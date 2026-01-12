# The python script generates an Excel sheet to be used for training AI email categorization logic for the application ICPA.
# It processes emails from a specific folder structure where the folder name represents the categorization of all emails contained within.
# Additionally, it takes emails from an Excel export from the PROD system of ICPA and combines them into a consolidated set of test data.

import pandas as pd
import os
import shutil
import time
import datetime
import logging
from extract_msg import Message
import sys
sys.path.append('./testdatautils')
import icpa_testdatautils as itdu

# Check if the subject has more than 25 words
def check_subject_length(subject):
    word_count = len(subject.split())
    return word_count <= 25

# Combining two DataFrames into a single DataFrame,
def append_entries_to_dataframe(df, subject_and_body, topic):
    data_object = {"Subject_and_Body": subject_and_body, "Topic": topic}
    subject_topic_entry_df = pd.DataFrame([data_object])
    return pd.concat([df, subject_topic_entry_df], ignore_index=True)

# Loop through each msg file, check for a txt counterpart.
# If a txt counterpart is present append data of the txt file to the excel
# Else apply the necessary blockers with prefixes and profixes, cache the content as txt file, and then append to excel
def loop_msg(path,df):
    count = 0
    parent_folder = path
    for entry in itdu.traverse(path):
        logger.info(f'Entry is {entry}')
        if entry.name.endswith('.msg'):
            baseName_and_dirName = determine_name_of_txt_counterpart(entry,path)
            #If entry is a .msg file, check for a .txt counterpart, if a counterpart exists then take the content from the text file
            if os.path.exists(baseName_and_dirName['base_name_path']):
                    logger.debug(f'Text file of the same name exists')
                    with open(baseName_and_dirName['base_name_path'],'r', encoding = 'utf-8') as file:
                        subject_and_body = file.read()
                        # Check if the subject has no more than 25 words
                        subject = subject_and_body.split('\n')[0].replace('Subject: ', '')
                        if not check_subject_length(subject):
                            logger.debug("Subject has more than 25 words, moving to the next file")
                            continue
                        pegaTopic = baseName_and_dirName['dirname'].split('\\')[-1]
                        logger.debug(f'PegaTopic is {pegaTopic}')
                        pegaTopic = itdu.getTopicName(pegaTopic)
                        df = append_entries_to_dataframe(df, subject_and_body, pegaTopic)
                        logger.debug("File was appended to excel")
            else:
                new_path = itdu.rename(entry)
                if new_path:
                    entry = new_path
                dirname = os.path.dirname(entry.replace(path + '\\',''))
                # Check if 'entry' is an instance of os.DirEntry (which represents a directory entry)
                # If true, assign 'entry.path' (the path to the directory entry) to 'msg_path'
                # If false, assign 'entry' (assumed to be a path string) directly to 'msg_path'
                msg_path = entry.path if isinstance(entry, os.DirEntry) else entry
                logger.debug(f'Message path is {msg_path}')
                logger.debug(f'parent_folder is {parent_folder}')
                # Open the file at 'msg_path' in binary read mode ('rb')
                # Use a 'with' statement to ensure the file is properly closed after reading
                with open(msg_path, 'rb') as f:
                    msg = Message(f)
                    subject = msg.subject
                    body = msg.body
                    subject_and_body = f"Subject: {subject}\n{body}"
                    # Check if the subject has no more than 25 words
                    subject = subject_and_body.split('\n')[0].replace('Subject: ', '')
                    if not check_subject_length(subject):
                        logger.debug("Subject has more than 25 words, moving to the next file")
                        continue
                    subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'\b2100\d{6}\b', prefix="<Start:invoice_number>", postfix="<End>")
                    subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'\b2100\d{7}', prefix="<Start:invoice_number>", postfix="<End>")
                    subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'Kd\.-Nr\. \d{9}', prefix="<Start:Invoice number>", postfix="<End>")
                    subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'R\.Nr\. \d{10}', prefix="<Start:Invoice number>", postfix="<End>")
                    subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'M-\d{6}', prefix="<Start:object_number>", postfix="<End>")
                    subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'\d{3}-\d{7}/\d{2}', prefix="<Start:object_number>", postfix="<End>")
                    subject_and_body = replace_Disclaimer(subject_and_body)
                    subject_and_body += str(itdu.extract_text_from_attachment(msg, msg_path, parent_folder))
                    # Create a text file with the same content as the excel entry to reduce OCR usage thereby speeding up the process.
                    file_name =  os.path.basename(msg_path)
                    text_file_name = file_name.split('.')[0] + ".txt"
                    # Extract the directory path up to the last backslash in msg_path
                    # Name the text file the same as that of .msg file.
                    new_msg_path =  msg_path.rpartition('\\')[0]
                    file_path = os.path.join(new_msg_path, text_file_name)
                    logger.debug(f'File path is {file_path}')
                    with open(file_path, 'w', encoding='utf-8') as ocr_text_file:
                        ocr_text_file.write(subject_and_body)
                        ocr_text_file.close()
                pegaTopic = dirname.split('\\')[-1]
                pegaTopic = itdu.getTopicName(pegaTopic)
                # Match internal topics as defined in PEGA Prediction Studio
                # Do not add files which are categorized into "Topic not defined" into the Excel, but keep a count of it
                if pegaTopic == itdu.undefined_topic:
                    count += 1
                else:
                    df = append_entries_to_dataframe(df, subject_and_body, pegaTopic)
        else:
            logger.error('The file is not a .msg or .txt file')
    logger.info('Number of Topics not defined: %s', count)
    return df

#Checks for .txt counterpart for each entry
def determine_name_of_txt_counterpart(entry,path):
    location = {
        'base_name_path': '',
        'dirname': ''
    }
    if entry.name.endswith('.msg'):
            extension = '.txt'
    else:
            extension = '.msg'

    entry_name = entry.name
    logger.debug(f'Entry name is {entry_name}')
    entry_path = entry.path
    logger.debug(f'Entry path is {entry_path}')
    base_name = entry_name.split('.')[0] + extension
    logger.debug(f'Base name is {base_name}')
    new_entry_path =  entry_path.rpartition('\\')[0]
    location['base_name_path'] = os.path.join(new_entry_path, base_name)
    logger.debug(f'Base name path is {location['base_name_path']}')
    location['dirname'] = os.path.dirname(entry_path.replace(path + '\\',''))
    logger.debug(f'Directory name is {location['dirname']}')
    return location


#Reads the Excel file from production, formats subject_and_body, checks subject length, and adds to a new DataFrame
def loop_exceldf(file_path,df):
    excel_data = pd.read_excel(file_path, sheet_name='Rohdaten')
    # Loop through each row and log the Subject and Body along with the Topic
    for index, row in excel_data.iterrows():
        subject_and_body = row["Subject + Body (content)"]
        topic = row["Human Identified Topic"]
        training_candidate = row["Training candidate"]
        if (training_candidate):
            logger.info("True Case Scenario")
            if isinstance(subject_and_body, float):
                subject_and_body = str(subject_and_body)
            # Check if the subject has no more than 25 words
            subject = subject_and_body.split('\n')[0].replace('Subject: ', '')
            if not check_subject_length(subject):
                logger.debug("Subject has more than 25 words, moving to the next file")
                continue
            subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'\b2100\d{6}\b', prefix="<Start:invoice_number>", postfix="<End>")
            subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'\b2100\d{7}', prefix="<Start:invoice_number>", postfix="<End>")
            subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'Kd\.-Nr\. \d{9}', prefix="<Start:Invoice number>", postfix="<End>")
            subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'R\.Nr\. \d{10}', prefix="<Start:Invoice number>", postfix="<End>")
            subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'M-\d{6}', prefix="<Start:object_number>", postfix="<End>")
            subject_and_body = itdu.wrap_pattern(subject_and_body, pattern_to_wrap=r'\d{3}-\d{7}/\d{2}', prefix="<Start:object_number>", postfix="<End>")
            subject_and_body = replace_Disclaimer(subject_and_body)

            # Append subject_and_body to the new Excel sheet
            df = append_entries_to_dataframe(df, subject_and_body, topic)
    return df


# Checks for the pattern and when a pattern is found adds prefix and postfix and returns the text
def replace_Disclaimer(text):
    patterns = [r'External Email: Be cautious about the sender email address, attachments and links\. If uncertain use Report Message button\.',
    r'This is an external email\. Do you know who has sent it\? Can you be sure that any links and attachments contained within it are safe\? If in any doubt, use the Report Message button in your Outlook client to report this mail\.',
    r'This is an external email\.Do you know who has sent it\? Can you be sure that any links and attachments contained within it are safe\? If in any doubt, use the “Report Message” button in your Outlook client to report this mail\.',
    r'ACHTUNG: Diese E-Mail stammt von einem externen Kontakt\. Bitte gehen Sie mit Anhängen oder enthaltenen Links vorsichtig um\.',
    r'CYBER SECURITY WARNING: This email is from an external source - be careful of attachments and links\. Please follow the Cyber Code and report suspicious emails\.',
    r'Erfahren Sie, warum dies wichtig ist External Email: Do you know the sender\? Is the request to open attachments and click links legitimate\? If in doubt, use the Report Message button',
    r'External Email: Do you know the sender\? Is the request to open attachments and click links legitimate\? If in doubt, use the Report Message button\.']
    if isinstance(text, float):
        text = str(text)
    pattern_match_disclaimer = "No Disclaimer found"
    prefix = "<Start:Disclaimer>"
    postfix = "<End>"
    for pattern in patterns:
       pattern_match_disclaimer = itdu.wrap_pattern(text, pattern, prefix, postfix)
    return pattern_match_disclaimer




######################### -= MAIN =- #########################
startTime = time.time()
current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
# Define the log folder
log_folder = 'Log File'
log_filename = f'ICPA_{current_time}.log'
# Check if the log folder exists, if not, create it
if not os.path.exists(log_folder):
    os.makedirs(log_folder)

#Configure logging
log_path = os.path.join(log_folder, log_filename)
logging.basicConfig( level=logging.debug,  format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S', handlers=[
        logging.FileHandler(log_path),
        logging.StreamHandler()
    ])
logger = logging.getLogger("ICPA")
# Define the template and new Excel file names
template_path = 'TrainingData_Template.xlsx'
excel_file_name = 'ICPA_TrainingDataSet_' + current_time + '.xlsx'
sheet_name = 'DATA'
# Load the Excel file
file_path = input(r"Enter the path to the Excel File from production: ")
msg_folder_path = input(r"Enter the path to MASTER folder: ")

# Initialize DataFrame
df = pd.DataFrame()


# Load Excel data if a valid file path is provided
if not file_path:
    logger.warning("No Excel file path provided. Skipping data loading from production file.")
elif not os.path.exists(file_path):
    logger.error(f"File does not exist at path: {file_path}. Skipping.")
else:
    logger.info(f"Selected file path is: {file_path}")
    df = loop_exceldf(file_path, df)

# Process message folder if it exists
if not msg_folder_path:
    logger.warning("No MASTER folder path provided. Skipping message processing.")
elif not os.path.exists(msg_folder_path):
    logger.error(f"MASTER folder does not exist at path: {msg_folder_path}. Skipping.")
else:
    logger.info(f"Selected MASTER folder path is: {msg_folder_path}")
    df = loop_msg(msg_folder_path, df)

# Copy the template to create a new Excel file
shutil.copy(template_path, excel_file_name)

# Remove duplicates from DataFrame
df = df.drop_duplicates()

# Save the DataFrame to Excel
with pd.ExcelWriter(excel_file_name, engine='xlsxwriter') as writer:
    df.to_excel(writer, sheet_name=sheet_name, index=False)

logger.info("Excel file created successfully.")
logger.info(df)


#Calculate total run time of the script
endTime = time.time()
elapsedTime = endTime - startTime
logger.info('DONE! Total elpased time in seconds: %s', elapsedTime)
