How to block users after multiple failed login attempts in AWS Cognito.

AWS Cognito is a cloud authentication provider solution similar to OneLogin or Auth0. It’s one of the products in Amazon Web Services cloud platform.
It offers web and mobile authentication solution package by implementing commonly required components, like user sign-up, sign-in, OAuth2 flows (including support social identity providers such as Facebook and Google), JWT token generation, enterprise identity providers via SAML 2.0, user management and access control.

It’s neither as feature rich nor easy to use like other solutions, but it’s definitely the cheapest. Especially for enterprise use cases (own data store, single sign-on vis SAML etc). It also provides a fair bit of customization abilities, so even though it doesn’t have some features like captcha or blocking users after multiple failed login attempts it’s possible to implement those using Cognito Lambda triggers.

In this post we will look into implementing a security handler for multiple failed login attempts in AWS Cognito. For the purpose of example our requirements are as follows:

- block user account after 5 consecutive failed login attempts
- require user to reset his password to regain access

This is possible utilizing Cognito Lambda triggers functionality. Cognito allows us to hook up our own Lambda functions to customize it’s behaviour.
In particular we’re interested in the following Lambda triggers:

- pre auth trigger, called on each authorisation attempt, intended to be used for additional checks
- post auth trigger, called after successful authorization
- custom message, called on each e-mail being send, it can be used to dynamically customize the e-mail message

Following diagram illustrates all the pieces:

We will use the `pre auth` lambda trigger to count the number of login attempts for the user, and also to check if the number of maximum attempts has be exceeded. If the user exceeded the maximum number of attempts we will lock the account by changing user status to `REQUIRE_RESET`. This will require user to reset his password before he can log it.

Example pre auth lambda:

- we call the AWS SDK to initiate password reset flow
- we need to remember to reset the counter as well so the user will be able to login after he resets his password
- For simplicity we save the number of attempts in user profile custom property. I don’t see any problems with that, but as an alternative you could store the counter in DynamoDB for example.
- we mark the profile as locked which would allow us change the e-mail message that gets send when password reset flow is initiated. We would use yet another lambda trigger (custom message) for that. Unfortunatelly I wasn’t able to find a way to change user status to REQUIRE_RESET without sending an e-mail with the code.

We will use the post auth trigger lambda to make sure login attempts counter is reset to 0. This lambda is called each time the user successfully logs in and we can utilize that fact to reset the counter on every successful login.

At this point we have a working solution. User account is locked after 5 consecutive failed login attempts and after successful password reset user can log back without any problems.

<!-- <IMAGE WITH COGNITO UI passwd reset flow> -->

However, because calling `adminResetPass` causes Cognito to send a code verification email (or SMS) the user ends up receiving an email even before he initiates the password reset. To fix that we will use the custom message Lambda trigger.

In the Lambda, for each password reset message trigger (trigger source CustomMessage_ForgotPassword) we check if user account was locked by our too many failed login attempts check. If so, we send appropriate “account locked” message and unlock the account (resetting the flag). If not, we just send the standard verification code message.

Unfortunatelly we can’t just not send any e-mail when password reset happens. What is more, even though we do not need the password reset verification code in our customized account locked e-mail, we still need to include it as Cognito checks if out message template contains it (required).
