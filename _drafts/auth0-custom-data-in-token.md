# How to add custom data to Auth0 JWT tokens

Auth0 is a great tool for streamlining common authentication and authorisation flows.
It supports OAuth, JWT, SAML etc.

I've often used it as na authentication layer for the REST APIs,
as it's very easy to integrate the JWT issuing and verification
capabilities to the backend services.

Working on microservices architecture recently I've also found Auth0 useful for 
3rd party application authentication or inter service authentication.

You can POST to `https://<YOUR_ACCOUNT>.auth0.com/oauth/token` to get the JWT token passing in your client id and secret in the body
```
{
    "client_id": "",
    "client_secret": "",
    "audience": "",
    "grant_type": "client_credentials",
    "meta": {}
}
```

You can add user or application specific metadata easily in the Auth0 dashboard.
However 

But for 

You can use Hooks to add custom claims to the JWT token
```
module.exports = function(client, scope, audience, context, cb) {
  var access_token = {};
  access_token.scope = scope;
  access_token['https://domain.com/meta'] = context.webtask.body.context.body.meta;

  cb(null, access_token);
};
```


