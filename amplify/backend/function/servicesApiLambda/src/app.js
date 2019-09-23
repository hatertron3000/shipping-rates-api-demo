/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageDynamoStoresName = process.env.STORAGE_DYNAMOSTORES_NAME
var storageDynamoStoresArn = process.env.STORAGE_DYNAMOSTORES_ARN
var authCognitoStoresUserPoolId = process.env.AUTH_COGNITOSTORES_USERPOOLID

Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk')
const dynamoDbClient = new AWS.DynamoDB.DocumentClient()
const cognitoClient = new AWS.CognitoIdentityServiceProvider()

async function getUserFromEvent(event) {
  console.log(event)
  const userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
  const params = {
    UserPoolId: process.env.AUTH_COGNITOSTORES_USERPOOLID,
    Filter: `sub = "${userSub}"`,
    Limit: 1
  }
  try {
    let users = await cognitoClient.listUsers(params).promise()
    if (!users.Users.length) {
      return new Error('No user retrieved')
    }
    let user = users.Users[0]
    return user
  }
  catch (err) {
    console.log(err)
    return err
  }
}

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

function servicesAreValid(services) {
  let servicesAreValid = true
  services.forEach(service => {
    if (typeof service.name !== 'string'
      || typeof service.price !== 'number'
      || typeof service.expedited !== 'boolean'
      || typeof service.transit_time.duration !== 'number'
      || typeof service.transit_time.units !== 'string')
      servicesAreValid = false
  })

  return servicesAreValid
}

/*
hash = abcd1234
services = [
  {
    name: "Standard Delivery",
    price: 12.51,
    expedited: false,
    transit_time: {
      duration: 7,
      units: "BUSINESS_DAYS"
    }
  }
]
*/
async function putServices(hash, services) {
  return new Promise((resolve, reject) => {
    if (servicesAreValid(services))
      try {
        const params = {
          TableName: process.env.STORAGE_DYNAMOSTORES_NAME,
          Key: { Hash: hash },
          UpdateExpression: 'set #s = :s',
          ExpressionAttributeNames: {
            '#s': 'Services'
          },
          ExpressionAttributeValues: {
            ':s': services
          },
          ReturnValues: "UPDATED_NEW"
        }

        dynamoDbClient.update(params, (err, data) => {
          if (err) {
            console.log(err)
            reject(`Error updating services for ${hash}`)
          }
          else {
            console.log(`updated services for ${hash}`)
            resolve(data.Attributes.Services)
          }
        })
      }
      catch (err) {
        console.log(err)
        reject(err)
      }
    else {
      console.log(`Services are invalid for request from ${hash}. Services provided:
    ${JSON.stringify(services, null, 2)}`)
      reject(`Services are invalid.`)
    }
  })
}

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


/**********************
 * GET *
 **********************/

app.get('/services', async function (req, res) {
  try {
    const user = await getUserFromEvent(req.apiGateway.event)
    const hash = user.Username
    const services = await getServices(hash)
    res.status(200).json(services)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error retrieving services', status: 500 })
  }
})

app.get('/services/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

/****************************
* POST *
****************************/

app.post('/services', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

app.post('/services/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

/****************************
* PUT *
****************************/

app.put('/services', async function (req, res) {
  const user = await getUserFromEvent(req.apiGateway.event)
  const hash = user.Username
  const services = req.body
  putServices(hash, services)
    .then(data => {
      console.log(`About to respond, here's the data:
    ${JSON.stringify(data, null, 2)}`)
      res.status(200).send(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ message: 'Error updating services.' })
    })
})


app.put('/services/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

/****************************
* DELETE *
****************************/

app.delete('/services', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

app.delete('/services/*', function (req, res) {
  res.status(405).json({ message: 'unsupported' })
})

app.listen(3000, function () {
  console.log("App started")
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
