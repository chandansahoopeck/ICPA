# This script processes email message files (.msg) from a specified folder and its subfolders,
# extracts their content, categorizes them based on predefined PEGA prediction topics,and
# generates a structured Excel file for testing and validating the quality of topic categorizations.

# Intended for use in QA/testing environments to evaluate the accuracy of automated topic classification
import os
import shutil
import time
import datetime
from extract_msg import Message
from openpyxl import load_workbook
import logging
import sys
sys.path.append('./testdatautils')
import icpa_testdatautils as itdu

# Processes .msg email files from the given folder and its subfolders, extracts their
# subject and body content, maps them to PEGA prediction topics,and writes the results into the provided Excel worksheet.

def create_test_data_excel_sheet(path,data_sheet):
    count = 0
    parent_folder = path
    for entry in itdu.traverse(path):
        if entry.name.endswith('.msg'):
            new_path = itdu.rename(entry)
            if new_path:
                entry = new_path
            dirname = os.path.dirname(entry.replace(path + '\\',''))
            # Check if 'entry' is an instance of os.DirEntry (which represents a directory entry)
            # If true, assign 'entry.path' (the path to the directory entry) to 'msg_path'
            # If false, assign 'entry' (assumed to be a path string) directly to 'msg_path'
            msg_path = entry.path if isinstance(entry, os.DirEntry) else entry
            logger.info(f'Message path is {msg_path}')
            logger.info(f'parent_folder is {parent_folder}')
            # Open the file at 'msg_path' in binary read mode ('rb')
            # Use a 'with' statement to ensure the file is properly closed after reading
            with open(msg_path, 'rb') as f:
                msg = Message(f)
                logger.info(f'Message is: {msg}')
                subject = msg.subject
                body = msg.body
                subject_and_body = f"Subject: {subject}\n{body}"
                logger.info(f'Subject and Body is: {subject_and_body}')
                pegaTopic = dirname.split('\\')[-1]
                pegaTopic = itdu.getTopicName(pegaTopic)
                data_sheet.append([subject_and_body, pegaTopic])

        else:
            logger.info('The file is a .msg or .txt file')
    logger.info('Number of Topics not defined: %s', count)





######################### -= MAIN =- #########################
#To calculate total run time of the script
startTime = time.time()
current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
logging.basicConfig(filename=f'ICPA_{current_time}.log', format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO,   datefmt='%Y-%m-%d %H:%M:%S')
logger = logging.getLogger("ICPA")
# Path to the root folder containing all the emails
# Ask for the file location
msg_folder_path = input(r"Enter the path to the folder holding email files: ")
logger.info(f"Selected file path is:{msg_folder_path}")
# Save a copy of the template file with the desired name
excel_file_name = input('Name for the Excel file (empty to autogenerate): ')
if excel_file_name.strip() == '':
    excel_file_name = 'SendTestDataSet_' + current_time
excel_file_name = excel_file_name + '.xlsx'
shutil.copy('TestData_template.xlsx',excel_file_name)

# Load the emails into excel sheet
wb = load_workbook(excel_file_name)
data_sheet = wb['DATA']
create_test_data_excel_sheet(msg_folder_path,data_sheet)


# Refresh the Pivot table
data_sheet = wb['PIVOT']
pivot = data_sheet._pivots[0]
pivot.cache.refreshOnLoad = True

# Save the file
wb.save(excel_file_name)
wb.close()

#Calculate total run time of the script
endTime = time.time()
elapsedTime = endTime - startTime
logger.info('DONE! Total elpased time in seconds: %s', elapsedTime)
