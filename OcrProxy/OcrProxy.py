from flask import Flask, request
import requests 
import base64
import json
import io
import logging
import boto3
from pdf2image import convert_from_bytes
from pdf2image.exceptions import PDFInfoNotInstalledError, PDFPageCountError, PDFSyntaxError
from botocore.exceptions import BotoCoreError, ClientError
import botocore.session
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
import uuid



app = Flask(__name__)


# simple proxy application forwarding incoming calls to ocr service "textract"
# can be run in development flask server via
#
#       flask --app OcrProxy run 
#
# BUT for production quality, a WSGI compliant server
# (essentially python compliant/enabled server) needs to be used
# e.g. 
#
#       gunicorn -w 4 SigningProxy:app 
#
# starting a gunicorn server with 4 worker threads running the sample application
#
# or 
#
#       gunicorn --config gunicorn_config.py OcrProxy:app
#
# using config file gunicorn_config.py
# 
# gunicorn package itself as well as flask can be installed the usual way via 
#
#        pip install gunicorn flask


###################################
# DO check on TODO comments below!!
###################################


# TODO: extract Lambda logic for directly calling Textract into a library/module 
# and have it used by OcrProxy and scrpt for creating training dara 


# TODO: enable logging to CloudWatch?
# TODO: enable https?? https://stackoverflow.com/questions/7406805/running-gunicorn-on-https


###############################################################
# calling actual protected functional url of lambda vfde-ocr 
# using proper aws signing methods 
# lambda in turn will then call textract
# TODO: decide if this signed call or direct textract call 
# approach is to be used and then delete the respective other
# TODO: enable logging to CloudWatch? Also need access logging similar to apache
###############################################################
@app.route("/extract_plain_text_using_signed_call",  methods = ['POST'])
def handle_extract_plain_text_using_signed_call():
    data = request.data
    data = data.decode('utf-8')
    data_json = json.loads(data)
    payload = {
        'name' : data_json['name'],
        'extension' : data_json['extension'],
        'content' : data_json['content']
    }
    session = botocore.session.Session()
    # TODO: make region configurable
    sigv4 = SigV4Auth(session.get_credentials(),
                    service_name="lambda",
                    region_name="eu-central-1")

   
    # TODO: Make lambda fucntional URL configurable
    # vfde-ocr requires proper iam role to be assigned to container
    url = "https://abb3r2e3keb2nlpqv64ovxhnby0rdxcf.lambda-url.eu-central-1.on.aws/"

    outbound_request = AWSRequest(method="POST", url=url, data=json.dumps(payload))
    sigv4.add_auth(outbound_request)
    signed = outbound_request.prepare()

    response = requests.post(signed.url,
                            headers=signed.headers,
                            data=signed.body)
    # TODO: to be tested if proper json format is getting returned
    return str(response.text)

#################################################################
# ACTUAL target solution
# calling textract directly, without any lambda in between
# essentially using 99% exact same logic from previous lambda fct
# TODO: decide if signed call or direct textract call 
# approach is to be used and then delete the respective other
# TODO: enable logging to CloudWatch? Also need access logging similar to apache
#################################################################
@app.route("/extract_plain_text",  methods = ['POST'])
def handle_extract_plain_text():
    data = request.data
    data = data.decode('utf-8')
    data_json = json.loads(data)
    textract_result = call_textract(data_json)
    body = textract_result['body']
    statusCode = textract_result['statusCode']
    contentType = {'Content-Type': 'application/json'}
    return body, statusCode, contentType


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# ==================== MAIN ====================
# essentially same logic previously used in lambda fct
# references to "context" object removed, creating jobID using uuid
# TODO: make region "eu-central" configurable
# TODO: enable logging to CloudWatch? Also need access logging similar to apache
def call_textract(json_body):
    supported_file_formats = ['PDF', 'TIF', 'TIFF', 'JPG', 'JPEG', 'PNG']
    error_code_list = ['InternalError', 'MissingArgument', 'UnsupportedFileFormat']
    arr_pages = []
    page_count = 0

    response_ok_dic = {
        'jobID': '',
        'name': '',
        'extension': '',
        'pageCount': 0,
        'pages': []
    }

    response_error_dic = {
        'jobID': '',
        'errors': []
    }

    arr_errors_found = []

    jobID = str(uuid.uuid4())

    try:

        # Check required fields
        if 'content' not in json_body or not json_body['content'].strip():
            arr_errors_found.append({'error_code': error_code_list[1], 'error_message': 'Required attribute [content] is missing or empty'})

        if 'name' not in json_body or not json_body['name'].strip():
            arr_errors_found.append({'error_code': error_code_list[1], 'error_message': 'Required attribute [name] is missing or empty'})

        if 'extension' not in json_body or not json_body['extension'].strip():
            arr_errors_found.append({'error_code': error_code_list[1], 'error_message': 'Required attribute [extension] is missing or empty'})
        elif json_body['extension'].upper() not in supported_file_formats:
            arr_errors_found.append({'error_code': error_code_list[2], 'error_message': f"{json_body['extension'].upper()} is not a supported format"})

        # Prepare error response if validation errors found
        if arr_errors_found:
            logger.warning(f"Validation errors found: {arr_errors_found}")
            response_error_dic['errors'] = arr_errors_found
            response_error_dic['jobID'] = jobID
            return {"statusCode": 400, "body": json.dumps(response_error_dic)}

        # Convert Base64 to bytes for processing
        try:
            content_bytes = base64.b64decode(json_body['content'])
            logger.info('Base64 content decoded successfully')
        except (base64.binascii.Error, ValueError) as e:
            logger.error(f"Error decoding Base64 content: {e}")
            arr_errors_found.append({'error_code': error_code_list[0], 'error_message': 'Invalid Base64 content'})
            response_error_dic['errors'] = arr_errors_found
            response_error_dic['jobID'] = jobID
            return {"statusCode": 400, "body": json.dumps(response_error_dic)}

        if json_body['extension'].upper() != 'PDF':
            page_count = 1
            logger.info('Extracting text from image...')
            extracted_text = get_text(content_bytes)
            arr_pages.append({'index': 1, 'text': extracted_text})
        else:
            try:
                pages = convert_from_bytes(pdf_file=content_bytes, dpi=150)
                for count, page in enumerate(pages):
                    page_count = count + 1
                    logger.info(f'Extracting page {page_count} from PDF...')
                    image_bytes = io.BytesIO()
                    page.save(image_bytes, 'JPEG')
                    extracted_text = get_text(image_bytes.getvalue())
                    arr_pages.append({'index': page_count, 'text': extracted_text})
            except (PDFInfoNotInstalledError, PDFPageCountError, PDFSyntaxError) as e:
                logger.error(f"Error processing PDF: {e}")
                arr_errors_found.append({'error_code': error_code_list[0], 'error_message': str(e)})
                response_error_dic['errors'] = arr_errors_found
                response_error_dic['jobID'] = jobID
                return {"statusCode": 400, "body": json.dumps(response_error_dic)}

        response_ok_dic['jobID'] = jobID
        response_ok_dic['name'] = json_body['name']
        response_ok_dic['extension'] = json_body['extension']
        response_ok_dic['pageCount'] = page_count
        response_ok_dic['pages'] = arr_pages

        return {"statusCode": 200, "body": json.dumps(response_ok_dic)}

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        error_message = f"Unexpected error: {str(e)}"
        response_error_dic['errors'].append({'error_code': error_code_list[0], 'error_message': error_message})
        response_error_dic['jobID'] = jobID
        return {"statusCode": 500, "body": json.dumps(response_error_dic)}

# ========== To extract individual lines from the Textract response ==========
def get_text(base64_content):
    try:
        # TODO: make region configurable
        textract = boto3.client("textract", "eu-central-1")
        response = textract.detect_document_text(Document={"Bytes": base64_content})
        text = [block["Text"] for block in response["Blocks"] if block["BlockType"] == 'LINE']
        return ' '.join(text).strip()
    except (BotoCoreError, ClientError) as e:
        logger.error(f"Error calling Textract: {e}")
        return ''
