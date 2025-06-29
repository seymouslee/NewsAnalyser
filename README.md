# 📰 TL;DR Times
<p align="center">
    <img  alt="TLDR Times main page" src="./readmeResources/mainpage.png">
</p>

TL;DR Times is a web app that takes your news articles and summarises it. 

Built with React and Tailscale as the Frontend, and Python Lambda as the backend.

### Table of Contents
1. [Tech Stack](#tech-stack)
2. [Setting Up the Front End](#setting-up-the-front-end)
3. [Setting Up the Back End](#setting-up-the-backend)
4. [Connect The Frontend to the Backend](#connect-the-frontend-to-the-backend)
5. [Test Locally](#test-locally)
6. [Deployment](#deployment)
7. [APIs](#apis)

## Tech Stack
- Front End: React on AWS Amplify
- Back End: AWS API Gateway and AWS Lambda
  - Database: AWS DynamoDB
  - Storage: S3
  - User Management: AWS Amplify and AWS Cognito

## Setting Up the Front End
### Requirements
- node version: v22.16.0
- npm version: 10.9.2
### Installation
Clone this repository and install the dependencies needed for this project:
```bash
git clone https://github.com/seymouslee/NewsAnalyser.git
cd NewsAnalyser/frontend
npm install
```
### Installing and Setting Up Amplify
Amplify, an AWS service, will be used to manage user sign ups and logins, as well as storage for this web application.
```
npm install -g @aws-amplify/cli
amplify init
amplify add auth # Select "Default Configuration"
amplify add storage # Select "Content", and then "Auth Users Only"
amplify push
```
## Setting up the Backend
### Requirements for the Lambda
- Python version: 3.9
### Installation for the Lambda
1. First, we will need to create a lambda layer containing all the packages required for the Lambda Backend to process the articles, and return the results we need.  
```bash
cd NewsAnalyser/backend
pip install -r requirements.txt --platform manylinux2014_x86_64 --target ./python --only-binary=:all:
zip -r layer.zip python/
```
2. Upload the file layer.zip as a layer under the Lambda service in the AWS Console
### Provisioning the Lambda Function
Using the generated SAM template to convey the configuration done on the lambda. I did not write a proper IaC for this due to time limitations.
<details>
<summary>Lambda Backend SAM Template</summary>

```
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: An AWS Serverless Application Model template describing your function.
Resources:
  analyzeArticles:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Description: ''
      MemorySize: 128
      Timeout: 60
      Handler: lambda_function.lambda_handler
      Runtime: python3.9
      Architectures:
        - x86_64
      EphemeralStorage:
        Size: 512
      Environment:
        Variables:
          BUCKET_NAME: <Amplify Bucket Name>
          OPENAI_API_KEY: <Open API Key>
          TABLE_NAME: <Table Name>
      EventInvokeConfig:
        MaximumEventAgeInSeconds: 21600
        MaximumRetryAttempts: 2
      Layers:
        - !Ref Layer1
      PackageType: Zip
      Policies:
        - Statement:
            - Sid: S3Access
              Effect: Allow
              Action:
                - s3:Get*
                - s3:Put*
              Resource: arn:aws:s3:::<BUCKETNAME>-dev/*
            - Sid: PutItemDynamoDB
              Effect: Allow
              Action:
                - dynamodb:Put*
              Resource:
                - >-
                  arn:aws:dynamodb:ap-southeast-1:888888888888:table/NewsAnalysisResults
            - Effect: Allow
              Action:
                - logs:CreateLogGroup
              Resource: arn:aws:logs:ap-southeast-1:888888888888:*
            - Effect: Allow
              Action:
                - logs:CreateLogStream
                - logs:PutLogEvents
              Resource:
                - >-
                  arn:aws:logs:ap-southeast-1:888888888888:log-group:/aws/lambda/analyzeArticles:*
      RecursiveLoop: Terminate
      SnapStart:
        ApplyOn: None
      Events:
        Api1:
          Type: Api
          Properties:
            Path: /analyze
            Method: POST

  Layer1:
    Type: AWS::Serverless::LayerVersion
    Properties:
      ContentUri: <uploaded layer.zip>
      LayerName: <layer name>
      CompatibleRuntimes:
        - python3.9
```
</details>
Afterwards, Upload the files, `./backend/lambda_function.py` and `./backend/utils.py` into the lambda function

### Provisioning the DynamoDB Table
Set the Parition and Sort Key with the following details:
- Partition Key
  - Name: FilePath (String)
- Sort Key
  - Name: TimeStamp (String)

Then make sure to update the Environment Variables of your lambda function to have the following values:
```
{
  "TABLE_NAME": "<your dynamodb table name>"
}
```

### Provisioning the APIGW
1. Create new APIGW
2. Create new resource path for `/analyze`
   1. Enable CORS (Cross Origin Resource Sharing)
3. Create new method under `/analyze`:
   1. Method Type: `POST`
   2. Integration Type: Lambda Function
   3. Enable Lambda Proxy Integration
   4. Select the Lambda Function that you've created
4. Deploy API to stage 

Now you would have generated the backend endpoint that you can use to update your frontend to point to.

## Connect The Frontend to the Backend
Create a `.env` file in the `./frontend` directory of this project and fill it:
```
VITE_BACKEND_ENDPOINT=<Your Backend URL here>
```
The backend URL is the endpoint generated in the section, [Provisioning the APIGW](#provisioning-the-apigw).  
For documentation about the API, please go to the section, [APIs](#apis), to learn more about the Backend API.

## Test Locally
To test the web application on your local machine, run the following command:
```bash
npm run dev
```
You should be able to see the following output:
```text
  VITE v7.0.0  ready in 115 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
Copy and paste the URL in your browser and you should be able to access web page.


## Deployment
To deploy this application to a remote server, run the following command:
```
npm run build
```
It should generate a folder, `./dist`. Upload the contents within this folder to your server, and you should be able to view the web application in your remote server. For this project, I'm using AWS Amplify to host my backend due to its ease of use without much security trade-offs. 

## APIs
### `POST /analyze`
Takes in a news article in the form of raw text input or by referencing a file that has been uploaded onto S3. Returns a summarised article, list of nationalities mentioned, list of people or organisations mentioned.
#### Request
Content-Type: `mulitpart/form-data`

You must include **either**:

| Field     | Type   | Required | Description                                                                 |
|-----------|--------|----------|-----------------------------------------------------------------------------|
| `text`    | string | Optional | Raw textual content of the article.                                         |
| `filedir` | string | Optional | The object key that has been uploaded to the Amplify Bucket                 |

#### Example Request (with Axios)

```js
const formData = new FormData();

// Option 1: Analyze raw text
formData.append('text', 'The Prime Minister of Spain held a press conference...');

// Option 2: Analyze uploaded file in S3
formData.append('filedir', 'private/ap-southeast-1:uuid123/username/news.docx');

const response = await axios.post(
  backendEndpoint
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

#### Example Response
Status Code: `200 OK`  
Content-Type: `application/json`
```js
{
  "summary": "The Prime Minister of Spain announced...",
  "nationalities": ["Spanish"],
  "entities": ["The Spanish Government"]
}
```

## Limitations and Assumptions
1. No IaC for infrastructure provisioning
2. Organisations/People are one category under the requirements.
3. `.docx` files only contains text (No other elements like pictures)