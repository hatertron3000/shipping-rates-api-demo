/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageDynamoStoresName = process.env.STORAGE_DYNAMOSTORES_NAME
var storageDynamoStoresArn = process.env.STORAGE_DYNAMOSTORES_ARN

Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require('aws-sdk')
const dynamoDbClient = new AWS.DynamoDB.DocumentClient()

async function getServices(hash) {
  try {
    const table = process.env.STORAGE_DYNAMOSTORES_NAME
    const params = {
      TableName: table,
      Limit: 1,
      ExpressionAttributeValues: {
        ':h': hash
      },
      ExpressionAttributeNames: {
        '#Hash': 'Hash',
        '#Services': 'Services',
      },
      KeyConditionExpression: '#Hash = :h',
      ProjectionExpression: '#Services'
    }

    const results = await dynamoDbClient.query(params).promise()
    if (results.Items.length === 0) return null
    else {
      return results.Items[0].Services
    }
  }
  catch (err) {
    console.log(err)
    return null
  }
}


var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const uuid = require('uuid')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const generateRate = async (params) => {
  const rate_id = uuid()
  const cartRef = params.base_options.request_context.reference_values
    ? params.base_options.request_context.reference_values.find(ref => ref.name === 'cart_id')
    : 0
  const cart_id = cartRef ? cartRef.value : 0


  const text = JSON.stringify({
    message: "Rate requested",
    store_id: params.base_options.store_id,
    cart_id,
    rate_id,
  })

  let logging = text
  logging.origin = params.base_options.origin
  logging.destination = params.base_options.destination
  logging.items = params.base_options.items
  logging.expedited = params.connection_options.expedited

  const hash = params.base_options.store_id
  const services = await getServices(hash)

  let quotes = services
  console.log(`about to filter these quotes:
  ------------
  ${quotes}`)
  if (!params.connection_options.expedited)
    quotes = quotes.filter(quote => !quote.expedited)

  quotes = quotes.map(quote => ({
    code: `demo-${quotes.indexOf(quote)}`,
    display_name: quote.name,
    cost: {
      currency: 'USD',
      amount: quote.price,
    },
    transit_time: quote.transit_time
  }))

  const rate = {
    "quote_id": "sample_quote",
    "messages": [
      {
        text,
        "type": "INFO"
      }
    ],
    "carrier_quotes": [
      {
        "carrier_info": {
          "code": "mock",
          "display_name": "Mock Carrier"
        },
        quotes
      }
    ]
  }

  logging.quotes = quotes
  console.log(logging)
  return rate
}


/**********************
 * GET *
 **********************/

app.get('/rates', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

app.get('/rates/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

/****************************
* POST *
****************************/

app.post('/rates', async function (req, res) {
  const rate = await generateRate(req.body)
  if (rate)
    res.status(200).json(rate)
  else
    res.status(500).json({ message: "Error generating rate" })
})

app.post('/rates/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

/****************************
* PUT *
****************************/

app.put('/rates', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

app.put('/rates/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

/****************************
* DELETE *
****************************/

app.delete('/rates', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

app.delete('/rates/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

app.listen(3000, function () {
  console.log("App started")
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
