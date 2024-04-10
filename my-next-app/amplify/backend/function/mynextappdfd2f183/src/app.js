
/*
Use the following code to retrieve configured secrets from SSM:
const aws = require('aws-sdk');
const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["stripe_key"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();
Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
  ENV
  FUNCTION_MYNEXTAPP3840B87C_NAME
  REGION
Amplify Params - DO NOT EDIT */


const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const aws = require('aws-sdk');

// 创建 express 应用
const app = express()
app.use(bodyParser.json({
  verify: function(req, res, buf) {
    req.rawBody = buf.toString();
  }
}))
app.use(awsServerlessExpressMiddleware.eventContext())
// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// 获取 Stripe 密钥
const getStripeKey = async () => {
  const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["stripe_key"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();
  return Parameters[0].Value;
}
/**********************
 * Example get method *
 **********************/
app.get('/webhook', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});
app.get('/webhook/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});
/****************************
* Example post method *
****************************/


// Webhook POST 请求处理
app.post('/webhook', async function(req, res) {
  const stripeKey = await getStripeKey();
  const stripeClient = stripe(stripeKey);

  // 假设从请求体中获取客户 ID
  const customerId = req.body.customerId;
  try {
    const customer = await stripeClient.customers.retrieve(customerId);
    const userEmail = customer.email;
    const cognito = new aws.CognitoIdentityServiceProvider();

    const response = await cognito.adminCreateUser({
      UserPoolId: process.env.UserPoolId,
      Username: userEmail,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [{
        Name: 'email',
        Value: userEmail
      }]
    }).promise();

    console.log(response);
    res.json({ success: 'User created', response });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/webhook/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});
/****************************
* Example put method *
****************************/
app.put('/webhook', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});
app.put('/webhook/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});
/****************************
* Example delete method *
****************************/
app.delete('/webhook', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});
app.delete('/webhook/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});
app.listen(3000, function() {
    console.log("App started")
});
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
