# sms-forwarder

> Forward messages from a Twilio number to another phone number

## About

I wanted to set up a local US number that could receive messages and forward them to my mobile in another country. Unfortunately, Twilio numbers have [certain limitations](https://support.twilio.com/hc/en-us/articles/223181668-Can-Twilio-numbers-receive-SMS-from-a-short-code-) which mean they don't work for my use case. Sharing the code anyways...

## Pre-requisites

- AWS account
- Twilio account with an SMS capable number

## Setup

1. Add your AWS credentials to a [named profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)
1. Add your Twilio Account SID and Auth Token to AWS Systems Manager Parameter Store
   ```bash
   $ export AWS_DEFAULT_PROFILE=your_profile_name
   $ aws ssm put-parameter --name '/prod/sms-forwarder/twilio/account-sid' --type 'SecureString' --value 'YOUR_ACCOUNT_SID'
   $ aws ssm put-parameter --name '/prod/sms-forwarder/twilio/auth-token' --type 'SecureString' --value 'YOUR_AUTH_TOKEN'
   ```
1. Clone this repo
1. Copy/rename `.env.example` to `.env` and update with your details
1. Deploy!
   ```bash
   $ yarn
   $ yarn sls-deploy
   ```
1. Copy the endpoint and configure your Twilio phone number to call it (POST webhook) whenever it receives an SMS

## Teardown

1. Delete all the resources that [serverless](https://serverless.com/) helped create
   ```bash
   $ yarn sls-remove
   ```
1. Delete the secrets we added to SSM Parameter Store
   ```bash
   $ aws ssm delete-parameter --name '/prod/sms-forwarder/twilio/account-sid'
   $ aws ssm delete-parameter --name '/prod/sms-forwarder/twilio/auth-token'
   ```

## TODO

1. Only allow our Lambda's API to be called by Twilio servers
