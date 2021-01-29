---
title: How to create Node.js background task using Google Cloud Function and Pub/Sub
description: 
date: 
---

## Creating Node.js Cloud Function

```javascript
// index.js

exports.helloThere = () => {
  console.log("Yo!");
}
```

With message that can be used for params





## Triggering Node.js Cloud Function with Pub/Sub

```javascript
/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.helloPubSub = (data, context) => {
  const pubSubMessage = data;
  const name = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, "base64").toString()
    : "World";

  console.log(`Hello, ${name}!`);
};
```

## Deploying Node.js Cloud Function

Background function with pub/sub trigger on YOUR_TOPIC_NAME topic

```bash
gcloud functions deploy helloPubSub --runtime nodejs8 --trigger-topic YOUR_TOPIC_NAME
```

It will look for index.js file in current working direcatory. Use `--source`
https://cloud.google.com/sdk/gcloud/reference/functions/deploy#--source
for custom path.

### Custom build step

https://cloud.google.com/functions/docs/writing/specifying-dependencies-nodejs#executing_custom_build_steps_during_deployment
https://cloud.google.com/appengine/docs/standard/nodejs/running-custom-build-step#example

### ENV vars example

```bash
gcloud functions deploy FUNCTION_NAME --set-env-vars FOO=bar,BAZ=boo FLAGS...
```

### Access secrets

```javascript
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const name = 'projects/my-project/secrets/my-secret/versions/5';
// const name = 'projects/my-project/secrets/my-secret/versions/latest';

// Imports the Secret Manager library
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Instantiates a client
const client = new SecretManagerServiceClient();

async function accessSecretVersion() {
  const [version] = await client.accessSecretVersion({
    name: name,
  });

  // Extract the payload as a string.
  const payload = version.payload.data.toString();

  // WARNING: Do not print the secret in a production environment - this
  // snippet is showing how to access the secret material.
  console.info(`Payload: ${payload}`);
}

accessSecretVersion();
```

## Scheduling Node.js cron jobs using Cloud Scheduler
