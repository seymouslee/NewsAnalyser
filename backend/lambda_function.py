import os
from utils import (
    response,
    get_content,
    OpenaiResponse,
    DynamodbUpload,
)

BUCKET_NAME = os.environ['BUCKET_NAME']

def lambda_handler(event, context):
    print(f"recieved event: {event}")

    # Retrieve text from the target file/ text input
    try:
        content, object_key = get_content(event['body'])
    except Exception as parse_error:
        print(parse_error)
        return response(500, {"error": f"OpenAI error: {str(parse_error)}"})

    # Call OpenAI API to retrieve the summary of the news article
    try:
        result = OpenaiResponse(content)
        answer = result.output_text
        summary = answer.split("Countries_Listed:")[0].strip()
        nationalities = answer.split("Countries_Listed:")[-1].split("Entities_Listed:")[0].strip().split(", ")
        entities = answer.split("Entities_Listed:")[-1].strip().split(", ")
    except Exception as openai_error:
        print(openai_error)
        return response(500, {"error": f"OpenAI error: {str(openai_error)}"})

    # Upload items into Dynamodb
    try:
        DynamodbUpload(f"arn:aws:s3:::{BUCKET_NAME}/{object_key}", summary, nationalities, entities)
    except Exception as db_error:
        print(db_error)
        return response(500, {"error": f"DynamoDB error: {str(db_error)}"})
    print("Saved to DynamoDB")

    return response(200, {
        "summary": summary,
        "nationalities": nationalities,
        "entities": entities
    })
    