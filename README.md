# 📰 TL;DR Times
<p align="center">
    <img  alt="TLDR Times main page" src="./readmeResources/mainpage.png">
</p>

TL;DR Times is a web app that takes your news articles and summarises it. 

Built with React and Tailscale as the Frontend, and Python Lambda as the backend.

## Tech Stack
- Front End: React on AWS Amplify
- Back End: AWS API Gateway and AWS Lambda
  - Database: AWS DynamoDB
  - Storage: S3
  - User Management: AWS Amplify and AWS Cognito

## Setting it Up
### Front End
#### Requirements
- node version: v22.16.0
- npm version: 10.9.2
#### Installation
Clone this repository and install the dependencies needed for this project:
```bash
git clone https://github.com/seymouslee/NewsAnalyser.git
cd NewsAnalyser
npm install
```
#### Installing and Setting Up Amplify
Amplify, an AWS service, will be used to manage user sign ups and logins, as well as storage for this web application.
```
npm install -g @aws-amplify/cli
amplify init
amplify add auth # Select "Default Configuration"
amplify add storage # Select "Content", and then "Auth Users Only"
amplify push
```
#### Connect this Application to a Backend
Create a `.env` file in the root directory of this project and fill it:
```
VITE_BACKEND_ENDPOINT=<Your Backend URL here>
```
### Back End
#### Requirements
- node version: v22.16.0

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