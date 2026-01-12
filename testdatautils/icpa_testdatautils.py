# Collection of reusable logic within the context of test and AI training data generation for application ICPA
# This script processes folders and files related to PEGA-predicted topics, renames long filenames, extracts and OCRs attachments from .msg files, and logs all actions for traceability.

import os
import re
import logging
import uuid
import base64
import requests
import time
import datetime
from enum import Enum
import shutil

# List of all topics as configured on PEGA prediction
class PegaPredictionTopics(Enum):
    topic00z = '99z - Topic not defined'
    topic01a = '01a - Missing documents - position breakdown'
    topic01b = '01b - Missing documents - invoice'
    topic01c = '01c - Missing documents - damage report'
    topic02a = '02a - Objection - Old or pre existing damage'
    topic02b = '02b - Objection - does not recognize damage'
    topic02c = '02c - Objection - not responsible (but present on site)'
    topic02d = '02d - Objection - Deviation (depth and lateral)'
    topic02e = '02e - Objection - Invoice ammount'
    topic02f = '02f - Objection - Missing references'
    topic02g = '02g - Objection - incorrect planning documents'
    topic02h = '02h - Objection - no registry in land records'
    topic03a = '03a - Debt collection inquiries - documents'
    topic03b = '03b - Debt collection inquiries - Already paid'
    topic03c = '03c - Debt collection inquiries - Wrong damager'
    topic03d = '03d - Debt collection inquiries - Damager id'
    topic04a = '04a - Accounting - Proof of payment'
    topic04b = '04b - Accounting - Already paid'
    topic04c = '04c - Accounting - Double payments'
    topic04d = '04d - Accounting - Partial insurance payments'
    topic04e = '04e - Accounting - Reversals'
    topic04f = '04f - Accounting - Open claims'
    topic05a = '05a - Police/Prosecution - Termination of proceedings'
    topic05b = '05b - Police/Prosecution - Damage inquiries'
    topic05c = '05c - Police/Prosecution - Proceedings'
    topic05d = '05d - Police/Prosecution - Graffiti'
    topic06 = '06 - KFA Notifications'
    topic07 = '07 - No telephone only E-Mail'
    topic08 = '08 - Replies from Cities or Communities'
    topic09 = '09 - Replies or Re-registration from companies'
    topic10 = '10 - Legal fees / Counterinvoce'
    topic11a = '11a - Postal returns - Invoice'
    topic11b = '11b - Postal returns - Dunning notice'
    topic12 = '12 - Forwarded to insurance by damager'
    topic13 = '13 - Request for digital invoices'

undefined_topic = 'Action > ' + PegaPredictionTopics.topic00z.value


# Maps the first 3 characters of the folder name to a predefined PEGA topic code.
# Returns the full topic description if a match is found; otherwise, returns a default "undefined" topic.
def getTopicName(folderName):
    answer = ''
    for x in PegaPredictionTopics:
        if folderName[0:3].strip().lower() == x.value[0:3].strip().lower():
            answer = x.value
            break
    if answer != '':
        return 'Action > ' + answer
    else:
        return undefined_topic

# Traverses a folder and all its subfolders and returns all file and folder names from the path and its subfolders
def traverse(path):
    logger.debug('Count of files for folder ' + path + ' is ' + str(len(os.listdir(path))))
    for entry in os.scandir(path):

        if entry.is_dir(follow_symlinks=False):
            yield from traverse(entry.path)
        else:
            yield entry

# Renames a file if its name exceeds a specified length threshold.
# Purpose: - Ensures compatibility with systems (especially Windows) that have issues with long file paths.
#          - Prevents errors during file handling by shortening long filenames and appending a UUID for uniqueness.
# Returns:- The new file path if renamed, or the original path if no renaming was needed or an error occurred.
def rename(entry):
    file_extension = ""
    if entry.name.endswith('.msg'): file_extension = '.msg'
    else: file_extension = '.txt'
    threshold = 100 # Max allowed filename length before renaming
    limit = 64      # Portion of original name to keep before appending UUID
    entry_name = os.path.basename(entry).split('.')[0]
    logger.debug(f'Entry Name is {entry_name}')
    if len(entry.name) > threshold:
        logger.debug(f'Entry name is longer than {threshold} characters: {entry.path}')
        try:
            # Generate new filename with a UUID to ensure uniqueness
            new_filename = entry.name[:limit] + str(uuid.uuid4()) + file_extension
            new_file_path = os.path.join(os.path.dirname(entry.path), new_filename)

            # Use '\\?\' prefix to handle long paths in Windows
            original_path_with_prefix = r"\\?\{}".format(os.path.abspath(entry.path))
            new_file_path_with_prefix = r"\\?\{}".format(os.path.abspath(new_file_path))

            # Ensure the target directory exists before renaming
            if not os.path.exists(os.path.dirname(new_file_path_with_prefix)):
                logger.debug(f"Directory does not exist: {os.path.dirname(new_file_path_with_prefix)}")
            else:
                # Move the file to the new path
                shutil.move(original_path_with_prefix, new_file_path_with_prefix)
                logger.debug(f'Successfully renamed {original_path_with_prefix} to {new_file_path_with_prefix}')
                return new_file_path  # Return the new path after renaming
        except Exception as e:
            logger.error(f'Error renaming {entry.path}: {e}')
            return None
    else:
        return entry.path

def wrap_pattern(text, pattern_to_wrap, prefix, postfix):
    if isinstance(text, float):
        text = str(text)
    regex = re.compile(pattern_to_wrap, re.IGNORECASE)
    result = regex.sub(lambda match: prefix + match.group(0) + postfix, text)
    return result

# Check for attachments witnin the msg file, if attachment is a pdf,jpg or png, encode it to Base64 and sent it to OCR Textract
# Get the OCR response, unpack it, and append the text from OCR to the content for the excel.
# Todo: Hard coded Proxy-Server addresses have to be made configurable via an .INI file.
def extract_text_from_attachment(msg, path, parent_folder):
    if(msg.attachments):
        for attachment in msg.attachments:
            file_name =  os.path.basename(path)
            logger.debug(f'Attachment type is : {type(attachment)} location is {file_name}')
            change_extension = file_name.split('.')[0] + ".txt"
            check_file_name = os.path.join(parent_folder, change_extension)
            logger.debug(f'File name to be checked: {check_file_name}')
            if os.path.isfile(check_file_name):
                logger.debug("OCR has checked these files before")
                with open(check_file_name,'r', encoding = 'utf-8') as f:
                    results = f.read()
                    logger.debug(f'Content from existing txt file is {results}')
                    return results
            else:
                attachment_name = attachment.longFilename
                if attachment_name is not None:
                    file_extension = attachment_name.split('.')[-1]
                    logger.debug(f'Attachment long file name is {attachment_name} and extension is {file_extension}')
                    data = attachment.data #Binary data
                    if attachment_name.lower().endswith(('pdf','jpg','png')):
                        logger.debug(f'File {attachment.longFilename} is an accepted file')
                        base64_string = base64.b64encode(data).decode('utf-8')
                        url = 'https://7c4exe6iv3ufylgbtmgazokcsm0pabcq.lambda-url.eu-central-1.on.aws/?name="collection"'
                        proxies={
                            'http': 'http://139.7.95.74:8080',
                            'https': 'http://139.7.95.74:8080'}
                        payload = {
                            "name": file_name,
                            "extension": file_extension,
                            "content": base64_string
                            }
                        headers = {
                            'Content-Type': 'application/json'
                            }
                        try:
                            response = requests.post(url, json = payload, headers=headers, proxies = proxies)
                            logger.debug(f'response is {response}')
                            results = response.json()
                            text = results['pages']
                            text_data = [td.get('text', None)for td in text]
                            logger.debug(f'Text from OCR is {text_data}')
                            return text_data
                        except Exception as e:
                            logger.error(f'An unexpected error occured: {e}')
                        except LargeFileError as e:
                           logger.error(f"LargeFileError: {e}")
                        except BadGatewayError as e:
                             logger.error(f"BadGatewayError: {e}")
                    else:
                        logger.error("File is of an unacceptable filetype")

#------Main---------

startTime = time.time()
current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
# Define the log folder
log_folder = 'Log File'
log_filename = f'ICPA_{current_time}.log'
# Check if the log folder exists, if not, create it
if not os.path.exists(log_folder):
    os.makedirs(log_folder)
    print(f"Created log folder: {log_folder}")
#Configure logging
log_path = os.path.join(log_folder, log_filename)
logging.basicConfig( level=logging.DEBUG,  format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S',handlers=[
        logging.FileHandler(log_path),
        logging.StreamHandler()
    ])
logger = logging.getLogger("ICPA")
