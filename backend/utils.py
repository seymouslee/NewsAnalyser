
import json
from openai import OpenAI
import os
import time
import re
from docx import Document
import boto3
import subprocess

# Clients
OpenaiClient = OpenAI()
S3Client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

# S3
BUCKET_NAME = os.environ['BUCKET_NAME']
KEY_PREFIX = os.environ['KEY_PREFIX']

# DynamoDB
TABLE_NAME = os.environ['TABLE_NAME']
table = dynamodb.Table(TABLE_NAME)

def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": json.dumps(body)
    }

def get_text_from_docx(file_path):
    doc = Document(file_path)
    full_text = []

    for paragraph in doc.paragraphs:
        full_text.append(paragraph.text)

    return '\n'.join(full_text)

def save_value_as_file_s3(text):
    timestamp = int(time.time())
    filename = f"{timestamp}.txt"
    object_key = f"private/tmp/{filename}"
    local_path = f"/tmp/{filename}"
    with open(local_path, "w", encoding="utf-8") as f:
        f.write(text)
    S3Client.upload_file(local_path, BUCKET_NAME, object_key)
    return object_key



def get_content(body):
    object_key = ""
    # check for filedir in body
    if 'name="filedir"' in body:
        match = re.search(r'name="filedir"\r\n\r\n(.*?)\r\n------', body, re.DOTALL)
        if match:
            object_key = match.group(1).strip()
            print(f"object_key: {object_key}")

            # get file from S3 bucket
            # object_key = f"{KEY_PREFIX}/{filedir_value}"
            download_path = '/tmp/object_key'
            print(f"object_key: {object_key}")
            S3Client.download_file(BUCKET_NAME, object_key, download_path)
            subprocess.run(["ls", "-l", "/tmp"]) 

            if object_key.endswith(".docx"):
                # get text from .docx file
                content = get_text_from_docx(download_path)
            else:
                # get text from .txt file
                with open(download_path, 'r', encoding='utf-8') as file:
                    content = file.read()
    else:
        # get text from body
        content = body
        object_key = save_value_as_file_s3(content)
    return content, object_key

def OpenaiResponse(content):
    prompt = f"""
    Summarise this article into 3 paragraphs at most and list the nationalities, countries, people or organisation mentioned.
    At the end of the summary, make sure to mention the countries listed in the following format: Countries_Listed: countrya, countryb, countryc
    At the end of the summary, make sure to mention the people or ogranisation listed in the following format: Entities_Listed: persona, organisationb, etc
    If the article contains multiple or languages other than English, please summarise them in english.
    News Article:
    {content}
    """
    return OpenaiClient.responses.create(
            model="gpt-4",
            input=prompt
        )
    
def DynamodbUpload(FilePath, summary, nationalities, entities):
    # Save Results to DynamoDB
    timestamp = int(time.time())

    item = {
            "FilePath": FilePath,
            "TimeStamp": str(timestamp),
            "Summary": summary,
            "Nationalities": nationalities,
            "Entities": entities
        }

    print(f"items: {item}")
    table.put_item(Item=item)
    return