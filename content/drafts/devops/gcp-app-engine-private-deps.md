---
title: "How to deploy NodeJS app with private dependencies to Google App Engine"
date: 2020-03-04 21:26:12 +0900
description: ""
---

Google App Engine (GAE) is a nice and simple way to deploy your project. You can usually get up and running pretty quickly by using standard NodeJS runtime, which won't need much of configuration thanks to reasonable defaults. However, if your project has a private repository specified as dependency in the `package.json` file, then the standard setup won't work and we'll get an error when trying to deploy it:

```bash
npm ERR! fatal: Could not read from remote repository.
```

Fortunatelly there is a way to solve that. The idea is actually pretty simple, we'll store an encrypted credentials in our main project repository and make sure our Google App Engine deployment setup can decrypt it and run an authenticated process of installing dependencies (`npm install`). Unfortunatelly there are few steps we need to undergo to make it work. We'll need to prepare a custom setup for what normally is provided by the default GAE NodeJS runtime, which means our own Dockerfile, Cloud Build config file (`cloudbuild.yaml`) and a bit of additional setup in the Google Cloud Platform. But don't worry, got you covered!

You can find all the code presented in the post as an example solution on the Github repository: https://github.com/ognus/google-app-engine-cloudbuild-example

## More on the problem

Ok, so before we dive into the custom solution, let's quickly explore how the basic Google App Engine deployment setup actually looks like for NodeJS apps? If you don't care about the basic setup, skip ahead to the [solution](#What we will do (table of contents)).

Firstly, you need to create an `app.yaml` file in the project root directory to at least specify the runtime. We are working with NodeJS so a minimal file might looks something like that:

```yaml
runtime: nodejs10
```

The `app.yaml` file is a required config file to be able to deploy to Google App Engine. Beside specifying the runtime (NodeJS, Java, Ruby etc.) it's also a place to set some web server details and enviornmental variables your app uses, like Database access details etc. This is a file you'd need to commit to your Github repository, so make sure to not add include any credentails like passwords or API keys.

While deploying to GAE, the basic Cloud Build setup for NodeJS will run the `npm install` to install all your dependencies and call `npm start` for you. You just need to make sure your `package.json` contains a `start` script that will run the server on port `8080` (that's the default).

To get started, you'll need your to install the `gcloud` CLI/SDK ([see how to setup Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts)) and create a project in the Google Cloud Platform which is generally be as simple as

```bash
gcloud projects create [YOUR_PROJECT_NAME]
```

For more details see the official docs https://cloud.google.com/resource-manager/docs/creating-managing-projects

Now, you can kick of the deployment just by calling `gcloud app deploy`. And that's really it, this command will run a default Cloud Build process for the NodeJS runtime, which fetches the code from your repository, removes `node_modules`, runs a fresh install of the dependencies with `npm install` and starts the app (`npm start`).

If you haven't used Cloud Build with this project yet, then you might need to enable the Cloud Build API for the build and deployment to work by going to https://console.developers.google.com/apis/library/cloudbuild.googleapis.com.

All great, but as we already know, after you add a private GitHub repository as dependency the Cloud Build process fails with:

```bash
Step #1 - "builder": ERROR `npm_install` had stderr output:
Step #1 - "builder": npm ERR! Error while executing:
Step #1 - "builder": npm ERR! /usr/bin/git ls-remote -h -t ssh://git@github.com/ognus/private-lib-example.git
Step #1 - "builder": npm ERR!
Step #1 - "builder": npm ERR! Host key verification failed.
Step #1 - "builder": npm ERR! fatal: Could not read from remote repository.
Step #1 - "builder": npm ERR!
Step #1 - "builder": npm ERR! Please make sure you have the correct access rights
Step #1 - "builder": npm ERR! and the repository exists.
Step #1 - "builder": npm ERR!
Step #1 - "builder": npm ERR! exited with error code: 128
```

## What we will do (table of contents)

<!-- generate table of contents -->

As part of this private GitHub dependency solution we'll enable the following GCP APIs:

- Cloud Build API
- Cloud KMS API
- App Engine Admin API
- App Engine Flexible Environment API

## Before we start (prerequisites)

Before we start, we need to make sure we have all we need. So here are our prerequisites. If you already have a private GitHub repository with private dependency and a SSH key granting access to these repositories then you can skip straight to the [solution](#Solution).

### Private GitHub repository with private dependency

For starters, we need an actual NodeJS project hosted on GitHub as a private repository. It should also have another private GitHub repository as a dependency.

Well... it doesn't REALLY have to for all of this to work, but if you don't think you will need a private dependency then deployment to Google App Engine is much simpler. For example, [by using triggers](https://cloud.google.com/cloud-build/docs/running-builds/create-manage-triggers) the setup is minimal, as Cloud Build already has access to connected GitHub account.

Ok, let's get back to business with our private dependency. Our `package.json` could look something like that:

```json
{
  {
    "name": "google-app-engine-cloudbuild-example",
    "scripts": {
      "start": "node index.js"
    },
    "dependencies": {
      "private-lib-example": "github:ognus/private-lib-example"
    }
}
```

### SSH key

Another thing we need is an SSH key connected to GitHub account that grants at least a read access to the project repository and it's private dependency repository as well.

If be some chance you don't have an SSH key connected to your GitHub account yet or you wish to create a new one, [the official GitHub docs](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key) are pretty useful.

Make sure to not set the passphrase on the key, as Google Cloud Build won't be able to use it to authenticate to your GitHub account.

Make sure to check if you can succesfully clone the repositories on your local machine by using the SSH key, so you can be sure that at least the basics are working before we tackle to Docker and GCP Cloud Build setup.

## Solution

Let's make our NodeJS app with private dependencies work on Google App Engine. We'll need couple of things to get it up and running:

1. Encode our SSH file (`id_rsa.enc`)
2. Write the Dockerfile for the Cloud Build to build the image for the App Engine to run
3. Add the App Engine config file (`app.yaml`)
4. Add the Cloud Build config file (`cloudbuild.yaml`)

Our project's directory structure should look something like that:

```bash
├── .gcloudignore
├── .gitignore
├── Dockerfile
├── app.yaml
├── cloudbuild.yaml
├── id_rsa.enc # encoded SSH file
├── index.js
├── node_modules
│   └── ...
└── package.json
```

Let's start with the encryption of SSH key and Google Cloud KMS setup.

### 1. Encrypting and decrypting the SSH key

For the Cloud Build to be able to successfully `npm install` dependency hosted on private GitHub repository, we're going to store the private SSH key in the main project's repository. Yey! However, since we're not as crazy as you might think, we'll encrypt it.

To safely store our SSH key in the repository and to allow the Cloud Build to decrypt it, we'll use Cloud Key Management Service (KMS).

If you haven't used Google Cloud KMS with this project yet, then you might need to enable the Google Cloud KMS API to be able to encrypt and decrypt by going to https://console.developers.google.com/apis/api/cloudkms.googleapis.com/overview

#### Keyring setup at the Key Management Service

Create KeyRing object in Google Cloud's KMS by running the following command:

```bash
gcloud kms keyrings create my-keyring --location=global
```

KeyRing we've just created will act as a container for the CryptoKey we need to encrypt and decrypt information using KMS. To create a new CryptoKey called `github-key` we'll use this command:

```bash
gcloud kms keys create github-key \
--location=global \
--keyring=my-keyring \
--purpose=encryption
```

Having successfully created the CryptoKey we can proceed to encypting our GitHub SSH key with it.

#### Encrypting the SSH key with the Key Management Service

To encrypt with KMS we'll use the `gcloud kms encrypt` command and pass the names of the KeyRing and the CryptoKey we've created earlier.
We also need to specify the path (the `--plaintext-file=` option) to the SSH key we want to encrypt. Default one is usually located at `~/.ssh/id_rsa`.

```bash
gcloud kms encrypt \
--plaintext-file=[SSH_KEY_TO_ENCRYPT] \
--ciphertext-file=id_rsa.enc \
--location=global \
--keyring=my-keyring \
--key=github-key
```

After the GitHub SSH key has been encypted we can securelly add the `id_rsa.enc` file to the repository. We'll later setup up our Cloud Build config file to decrypt the key and use it to access the private repository.

#### Granting access for the Cloud Build service account

For the Cloud Build process to be able to later decrypt our encrypted SSH key it needs to be able to access our `github-key` CryptoKey. We'll grant the Cloud Build service account a permission to decrypt with the `github-key` CryptoKey by invoking the following command:

```bash
gcloud kms keys add-iam-policy-binding \
  github-key --location=global --keyring=my-keyring \
  --member=serviceAccount:[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com \
  --role=roles/cloudkms.cryptoKeyDecrypter
```

You can get the `PROJECT_NUMBER` from the Cloud Console UI or by running `gcloud projects list` to list your projects.

### 2. Dockerfile

We'll use the following Dockerfile to build the image that the App Engine can run.

```dockerfile
# Extending App Engine's NodeJS image
FROM gcr.io/google_appengine/nodejs

# Getting SSH_KEY value passed as docker build argument
ARG SSH_KEY

# Install SSH client
RUN apt-get install -y ssh-client

# Bundle app source
COPY . .

# Add the authorized host key for GitHub to avoid "Host key verification failed"
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# npm install
# passing SSH key to stdin instead persisting to file so it won't leak to one of the cached Docker layers
RUN ssh-agent sh -c 'echo $SSH_KEY | base64 -d | ssh-add - ; npm install'

# start
CMD npm start
```

Argueably, the most interesting part is the last `RUN` command where we pass the base 64 encoded SSH key to stdin of newly created `sh` subshell. We use stdin to avoid SSH leaking to one of the cached Docker layers.

There is a bit less hacky way to pass the SSH key to `npm install` using experimental Docker Buildkit. However I couldn't get the Docker Buildkit working with inside the `gcr.io/cloud-builders/docker` builder.

If you would like a deeper exlanation check out this great post by Sander Knape on [how to install private Git repositories in Docker](https://sanderknape.com/2019/06/installing-private-git-repositories-npm-install-docker).

### 3. Creating the App Engine app.yaml file

To be able to use our own Docker image on the App Engine we need to specify in our `app.yaml` file that we're going to use a custom runtime (our Docker image) and Flexible Environment. You can see the [comparison of Standard and Flexible App Engine enviornments for differences](https://cloud.google.com/appengine/docs/the-appengine-environments), but I think the main thing to keep in mind in pricing. Pricing scheme for Flexible App Engine is a bit different and it's generally more expensive, also because only the Standard Enviornment is part of the [free tier](https://cloud.google.com/free/docs/gcp-free-tier#always-free-usage-limits).

```yaml
env: flex
runtime: custom
```

If you haven't used the Flexible Enviornment with this project yet, then you might need to enable the Google App Engine Flexible Environment API for the App Engine deployment to work by going to
https://console.cloud.google.com/apis/library/appengineflex.googleapis.com

### 4. Creating the Cloud Build cloudbuild.yaml file

For starters, we'll need to define a persited volume in our `cloudbuild.yaml` file, so all the builders in the deployments steps could access it. We gonna use it to pass our GitHub SSH key around to make sure we have an authenticated access to our repositories on every build step.

We can do it by specifying the volume by name and path at the beginning of the `cloudbuild.yaml` file.

```yaml
options:
  volumes:
    - name: ssh
      path: /root/.ssh
```

After that, we can preceed to adding all the Cloud Build steps we'll for our build:

#### Build step 1: SSH key decryption

First, we need to decrypt the `id_rsa.enc` file. This step will save the decrypred file to default SSH identity location, which is `/root/.ssh/id_rsa` for Cloud Build builders.

After adding the first step, the build file might look sth like:

```yaml
options:
  volumes:
    - name: ssh
      path: /root/.ssh

steps:
  - name: gcr.io/cloud-builders/gcloud
    args:
      - kms
      - decrypt
      - --ciphertext-file=id_rsa.enc
      - --plaintext-file=/root/.ssh/id_rsa
      - --location=global
      - --keyring=my-keyring
      - --key=github-key
```

Because we have previously defined the shared volume with the path `/root/.ssh`, all the following build steps will now have access to our SSH key.

#### Build step 2: adding public host key to known_hosts

In this step we'll start by making sure our SSH key is readable by `chmod 600`. Next, we'll get the public host key of github.com and append it to the `known_hosts` file.

This way we can prevent git from prompting to add the key to `known_hosts` when we'll clone the repository from github.com using our SSH key and avoid the "Host key verification failed" error.

```yaml
- name: gcr.io/cloud-builders/git
  dir: /root/.ssh
  entrypoint: bash
  args:
    - "-c"
    - |
      chmod 600 id_rsa
      ssh-keyscan github.com > known_hosts
```

<!-- #### Build step 3: cloning the repository

Nothing too fancy going on here in step 3, we just clone the repo using the Cloud Build git builder.

```yaml
- name: gcr.io/cloud-builders/git
  args:
    - clone
    - git@github.com:ognus/kickass-project.git
```

One thing worth adding though is that the standard `git clone` command will fetch all remote branches (including remote `origin/master`) and create a local `master` branch.

If you would like to only fetch the `master` branch, or any other specific remote branch for that matter, without the need to fetch all of them. Use the `--single-branch` option:

```yaml
- name: gcr.io/cloud-builders/git
  args:
    - clone
    - -b
    - $BRANCH_NAME
    - --single-branch
    - git@github.com:ognus/kickass-project.git
``` -->

#### Build step 3: build the Docker image

Time to build the Dockerfile we've prepared earlier. We'll tag the local image with the registry name `gcr.io/$PROJECT_ID/my-image`. `$PROJECT_ID` is filled in automatically by the Cloud Build with the project name we created in the Google Cloud by calling `gcloud projects create YOUR_PROJECT_NAME`.

The interesting bit about this `docker build` command is that we're gonna pass the SSH key as base64 encoded string. We just need to make sure the encoded string doesn't have any newline characters by passing `-w 0` flag to `base64`. On Mac there is no wrapping by default when using `base64`, but the `gcr.io/cloud-builders/docker` builder Docker image is using Ubuntu as a base image.

```yaml
- name: gcr.io/cloud-builders/docker
  entrypoint: bash
  args:
    - "-c"
    - |
      docker build --build-arg SSH_KEY=$(cat /root/.ssh/id_rsa | base64 -w 0) -t gcr.io/$PROJECT_ID/my-image .
```

#### Build step 4: push the Docker image to the Container Registry

We push the image built in step 4 to the GCP's Container Registry, so the Google App Engine can access it when we deploy.

```yaml
- name: gcr.io/cloud-builders/docker
  args:
    - push
    - gcr.io/$PROJECT_ID/my-image
```

#### Build step 5: deploy the Docker image to the Google App Engine

For deployment to work we need to enable the Google App Engine Admin API by going to https://console.developers.google.com/apis/api/appengine.googleapis.com/overview

We also need to add permissions for the Cloud Build service account to be able to deploy to App Engine:

```bash
gcloud projects add-iam-policy-binding ognus-cloudbuild-example \
  --member serviceAccount:20772804985@cloudbuild.gserviceaccount.com \
  --role roles/appengine.appAdmin
```

We can now finally deploy our Docker image to the Google App Engine. We use the standard `gcloud app deploy` command and passing the image url `--image-url gcr.io/$PROJECT_ID/my-image`. This is the url of the image we've uploaded in previous step to the GCP's Container Registry.

```yaml
- name: gcr.io/cloud-builders/gcloud
  args:
    - app
    - deploy
    - app.yaml
    - --image-url
    - gcr.io/$PROJECT_ID/my-image
```

#### Final cloudbuild.yaml file

This is the complete cloudbuild.yaml file. We also increase the timeout of final step to make sure the deployment to the Google App Engine won't timeout the Cloud Build process.

```yaml
timeout: 1600s
options:
  volumes:
    - name: ssh
      path: /root/.ssh

steps:
  # Step 1: decrypt the file containing the key
  - name: gcr.io/cloud-builders/gcloud
    args:
      - kms
      - decrypt
      - --ciphertext-file=id_rsa.enc
      - --plaintext-file=/root/.ssh/id_rsa
      - --location=global
      - --keyring=my-keyring
      - --key=github-key

  # Step 2: add public github.com key to known_hosts
  - name: gcr.io/cloud-builders/git
    dir: /root/.ssh
    entrypoint: bash
    args:
      - "-c"
      - |
        chmod 600 id_rsa
        ssh-keyscan github.com > known_hosts

  # Step 3: build the Docker image
  - name: gcr.io/cloud-builders/docker
    entrypoint: bash
    args:
      - "-c"
      - |
        docker build --build-arg SSH_KEY=$(cat /root/.ssh/id_rsa | base64 -w 0) -t gcr.io/$PROJECT_ID/my-image .

  # Step 4: push the Docker image to the Container Registry
  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - gcr.io/$PROJECT_ID/my-image

  # Step 5: deploy the image to the Google App Engine
  - name: gcr.io/cloud-builders/gcloud
    args:
      - app
      - deploy
      - app.yaml
      - --image-url
      - gcr.io/$PROJECT_ID/my-image
    timeout: 1600s
```

## Starting the build

Finally we've got to the end and can start the build by running following command in the project's root directory:

```bash
gcloud builds submit .
```

Manually kicking off the build will help us to test our setup out, but it's defnitelly not very glamorous. Fortunatelly, we can automate it by using Cloud Build triggers.

### Cloud Build triggers

By creating a trigger, the Cloud Build will be able to connect to a source code repository and automatically start a build whenever the code changes.
You can follow the official documentation on [how to setup triggerts](https://cloud.google.com/cloud-build/docs/running-builds/create-manage-triggers) for all the details and additional setup, but basically we need to go through two a step process:

#### Conneting Cloud Build to a Github repository

Connect Cloud Build to your Github repository by going to [Triggers page in the Google Cloud Console](https://console.cloud.google.com/cloud-build/triggers), initiating and following an usual OAuth2 process.

#### Creating the build trigger

```bash
gcloud beta builds triggers create github \
--repo-name=[REPO_NAME] \
--repo-owner=[REPO_OWNER] \
--branch-pattern=".*" \
--build-config=[BUILD_CONFIG_FILE]
```

## Conclusion

- solution (easy vs hard)
- pricing ()
