'use strict';
const querystring = require('querystring');
const AWS = require('aws-sdk');
const twilio = require('twilio');

module.exports.forward = async (event, context) => {
  const twilioClient = await getTwilioClient();

  await twilioClient.messages.create({
    from: process.env.FROM_PHONE,
    body: createMessageBody(event.body),
    to: process.env.TO_PHONE
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/xml' },
    body: '<Response/>'
  };
};

function createMessageBody(message) {
  const parsedMessage = querystring.parse(message);
  return `From: ${parsedMessage.From}\n${parsedMessage.Body}`;
}

async function getTwilioClient() {
  const ssm = new AWS.SSM({ region: process.env.SLS_AWS_REGION });

  const [twilioAccountSid, twilioAuthToken] = await Promise.all([
    getSsmParameter(ssm, {
      Name: '/prod/sms-forwarder/twilio/account-sid',
      WithDecryption: true
    }),
    getSsmParameter(ssm, {
      Name: '/prod/sms-forwarder/twilio/auth-token',
      WithDecryption: true
    })
  ]);

  return twilio(twilioAccountSid, twilioAuthToken);
}

async function getSsmParameter(ssm, params) {
  const res = await ssm.getParameter(params).promise();
  return res.Parameter.Value;
}
