import serverless from "serverless-http";
import app from "./app";
import * as AWS from "aws-sdk";

module.exports.onConnect = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const dbClient = new AWS.DynamoDB.DocumentClient();
  const putParams = {
    TableName: "itgg-ws-connections",
    Item: {
      connectionId: connectionId,
      tag: null,
    },
  };
  try {
    await dbClient.put(putParams).promise();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
  return {
    statusCode: 200,
  };
};

module.exports.onDisconnect = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const dbClient = new AWS.DynamoDB.DocumentClient();
  const delParams = {
    TableName: "itgg-ws-connections",
    Key: {
      connectionId: connectionId,
    },
  };
  try {
    await dbClient.delete(delParams).promise();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
  return {
    statusCode: 200,
  };
};
module.exports.onBroadcast = async (event) => {
  let connectionData;
  const dbClient = new AWS.DynamoDB.DocumentClient();
  try {
    connectionData = await dbClient
      .scan({
        TableName: "itgg-ws-connections",
        ProjectionExpression: "connectionId",
      })
      .promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  const postData = JSON.parse(event.body).data;

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi
        .postToConnection({ ConnectionId: connectionId, Data: postData })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await dbClient
          .delete({
            TableName: "itgg-ws-connections",
            Key: { connectionId },
          })
          .promise();
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};

module.exports.handler = serverless(app);
