/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const uuid = require('uuid')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const generateRate = (params) => {
  const rate_id = uuid()
  const cartRef = params.base_options.request_context.reference_values
    ? params.base_options.request_context.reference_values.find(ref => ref.name === 'cart_id')
    : 0
  const cart_id = cartRef.value ? cartRef.value || 0


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

  const quotes = [
    {
      "code": "mock-1",
      "display_name": "Mock Service-1",
      "cost": {
        "currency": "USD",
        "amount": 8.00
      },
      "discounted_cost": {
        "currency": "USD",
        "amount": 6.00
      },
      "handling_fee": {
        "currency": "USD",
        "amount": 0.5
      },
      "transit_time": {
        "units": "BUSINESS_DAYS",
        "duration": 5
      }

    },
    {
      "code": "mock-2",
      "display_name": "Mock Service-2",
      "cost": {
        "currency": "USD",
        "amount": 8.00
      },
      "transit_time": {
        "units": "BUSINESS_DAYS",
        "duration": 5
      }
    },
    {
      "code": "mock-3",
      "display_name": "Mock Service-3",
      "cost": {
        "currency": "USD",
        "amount": 8.00
      },
      "transit_time": {
        "units": "BUSINESS_DAYS",
        "duration": 5
      }
    }
  ]

  if (params.connection_options.expedited)
    quotes.push({
      "code": "mock-expedited",
      "display_name": "Mock Service - Expedited",
      "cost": {
        "currency": "USD",
        "amount": 16.00
      },
      "transit_time": {
        "units": "BUSINESS_DAYS",
        "duration": 2
      }
    })

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

app.post('/rates', function (req, res) {
  const rate = generateRate(req.body)
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
