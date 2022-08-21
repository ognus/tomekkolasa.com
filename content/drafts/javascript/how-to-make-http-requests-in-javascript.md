---
title: How to make HTTP requests in JavaScript
---

In this post we will go through most of the ways you can send HTTP requests from the JavaScript code, both in the browser and the NodeJS runtime. We'll have a deeper look at each one of them, where I'll explain the code examples and discuss the pros and cons of the solution.

## Using pure JavaScript

JS nativelly supports two ways to send HTTP requests.

Let's start with JavaScript in the browser enviornment first. It provides us with two build-in ways to send a HTTP request. The older **XMLHttpRequest** object and the newer **Fetch API**. Although is prefferable to use the newer Fetch API, you still might need to work with XMLHttpRequest when dealing with older codebases or ancient browsers 😉

### XMLHttpRequest

Until fairly recently the only way to send requests to the browser without page reload (so called AJAX requests) was to use the XMLHttpRequest object.

XMLHttpRequest became wildly adopted by all major browsers by the end of 2006, and since allowed developers to send HTTP requests straight from JavaScript code and receive the response asynchnously. This made it possible to fetch data and update the UI without interupting users with the page reload. This programming technique is often refered to as AJAX (Asynchronous JavaScript and XML) programming and has been a term coined in the _Ajax: A New Approach to Web Applications_ paper by Jesse James Garrett in 2005.

AJAX made it possible to build rich single page applications like Gmail or Google Maps by using native web technologies. Previously such feets were only commonly possible with external solutions added to browsers via plug-ins like Adobe Flash or Java Applets. At that time XML was a de-facto standard for data interchange format both between services on the backend and the browser-server communiation using AJAX. It has been gradually replaced by JSON, which is smaller (less bytes to send over the network), faster (parsing is faster), and easier to work with in JavaScript, as you don't need an extra step of XML DOM traversal to convert it to JavaScript variables.

History lessons aside, let's better have a look at the example of how we send AJAX requests using XMLHttpRequest in JavaScript.
We'll create a POST request that sends user's email and password to the `https://example.com/login` endpoint.

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

// create response and error handlers
const xhr = new XMLHttpRequest();
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    // parse JSON to get to the auth token
    const { token } = JSON.parse(xhr.responseText);
  } else {
    // handle HTTP errors
    console.log(`HTTP error: ${xhr.status}`);
  }
};
xhr.onerror = () => {
  // handle network errors
  console.log("Network error");
};

// prepare the POST request
xhr.open("POST", "https://example.com/login");
xhr.setRequestHeader("Content-Type", "application/json");
// send the POST request with JSON data as POST body
xhr.send(JSON.stringify(data));
```

In our example we use `xhr.open()` to configure the request by specifing HTTP method and the URL. At this point nothing is send yet. Since it's a POST request and we'll be sending JSON encoded data, it's a good practice to tell to the server by specifying the content-type. We use `xhr.setRequestHeader` for setting the `'Content-Type'` header to `'application/json'`.

The `xhr.send()` call sends the request asynchronously. We pass in the login data object converted to JSON with `JSON.stringify()`. Once the server responds, the `xhr.onload` callback will get called, unless there was an error, in that case the `xhr.onerror` will get called. The `xhr.onerror` callback is called when the request could not be made or response was not delivered, which usually means a network error, server being down or unable to be found by DNS.

Let's look at how this example handles the response in the `xhr.onload` callback. We check the `xhr.status` for HTTP response code. If the value is between 200-299 we know the server responed successfully. We proceed to reading the response with `xhr.responseText` and using `JSON.parse` to convert response text to a JavaScript object so we can easilly read the `token` value. If we get an unexpected HTTP error codes like 4xx or 5xx we need to handle that appropriately.

That's pretty much how XMLHttpRequest works. Maybe beside a small caveat that the XMLHttpRequest specification allows for synchronous requests, so you might stumble upon something like this:

```javascript
var xhr = new XMLHttpRequest();
xhr.open("GET", "/", false); // sync request
// this will perform sync I/O and block the main thread
xhr.send();
```

However, because bloking calls in a single-threaded language like JavaScript are generally not a good idea, these functionality has been deprecated are currently blocked by new browsers. You can still use the synchronous API in the web workers however, which run on separate thread.

XMLHttpRequest is not the most pleasant to work with so you might not see it too often in the wild. Over the years, many external libraries provided easier to use wrappers around the XMLHttpRequest object, for example `jQuery.post()` or `axios.post()`.

### Fetch API

Fortunatelly, nowadays we can use the Fetch API. It is a replacement for the XMLHttpRequest object and was initially supported by Chrome and Firefox browsers as early as 2015. It's a modern API that relies on promises instead of callbacks and it's much nicer to use. Since around 2017 it has been widely adopted across all modern browsers.

Let's have a look at the Fetch API usage example. Same as in the XMLHttpRequest example, we create a POST request that sends user's email and password to the `https://example.com/login` endpoint.

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

try {
  const response = await fetch("https://example.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    // get JSON to get to the auth token
    const { token } = await response.json();
  } else {
    // handle HTTP errors
    console.log(`HTTP error: ${response.status}`);
  }
} catch (err) {
  // handle network errors and JSON parsing error
  console.log(err);
}
```

Similarly to the XMLHttpRequest example we convert our data to JSON string using `JSON.stringify()`. We just don't need to use `JSON.parse()` ourselves as this is already handled by the `response.json()` from the Fetch API. What's best about Fetch API however when compared to XMLHttpRequest is that it supports promises. Why this is great? Imagine you'd want to wrap this request sending code into a reusable function, let's say `login(email, password)`:

```javascript
async function login(email, password) {
  const response = await fetch("https://example.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    return response.json();
  }
  throw new Error(`HTTP error: ${response.status}`);
}

const data = { email: "goku@capsule.corp", password: "kamehameha" };

try {
  login("goku@capsule.corp", "kamehameha");
} catch (err) {
  // handle all errors in one place
  console.log(err);
}
```

Pretty slick code if you ask me. With `xhr.onload` you'd need to wrap the token response in a promise yourself or use a callback. Using Fetch API we can already use the token value in a synchronous fashion by leveraging the modern async/await syntax. It also allows us to handle errors in a synchronous way.

Is there a reason to use XMLHttpRequest API today? I would say, generally no. Fetch API is much easier to use and is equally powerful. Unless you need to support old browsers like IE11, but even then you can use fetch polyfill (TODO: add some link) or an external library like axios.

## Using popular HTTP request libraries for JavaScript

- Axios
- Ky
- Superagent
- Request
- jQuery

As we already experienced, working with nativelly supported XMLHttpRequest in the browser and the Node.js's http module is not as convenient as most of us would like. Because of that there has been quite a number of libraries developed to make sending HTTP requests easier. These external libraries aim to be easier to understand, help to implement common tasks with less code or simply to provide additional features. Historically, libraries like jQuery also provided a common abstraction that was hidding any differences between various browers' implementations of XMLHttpRequest.

Before we take a more detailed look at some of the most popular 3rd party libraries for sending HTTP requests, lets have a look at their footprint. External dependencies can quickly add up and make your project grow by additional 10s or 100s of kB. While usually not a major concern in Node.js, it really make a big difference for the browser. JavaScript code takes time to be downloaded, parsed and executed by the browser. So the more JavaScript code there is a page the longer it will take for it to be loaded and displayed to the user. As developers we usually care greatly about the JS code size, incorporating solutions like code minification, compression, tree shaking, as well as code splitting and lazy loading when project grows. I think we should also take great care about what dependencies we include in the project.

So here is the size comparison as of December 2021 (minified and gzipped):

| Library        | Version |                                             Bundle size |
| -------------- | ------- | ------------------------------------------------------: |
| **superagent** | 6.1.0   |                                                 10.1 kB |
| **axios**      | 0.24.0  |                                                  5.6 kB |
| **ky**         | 0.28.7  |                                                  2.7 kb |
| **redaxios**   | 0.4.1   | [1 kB](https://bundlephobia.com/package/redaxios@0.4.1) |

<!-- TODO add popularity (stars and downloads table) and chart from https://www.npmtrends.com/
https://www.npmtrends.com/axios-vs-got-vs-jquery-vs-request-vs-superagent -->

### Axios

Axios is a probably the most popular external library for sending HTTP requests. It's havily inspired by AngularJS internal library for HTTP requests. If you ever used old AngularJS's `$http` service you should feel right at home as the API is basically identical. Axios also has all the more advanced goodies like interceptors and transformers. But let's look at a basic example first.

We'll reuse our example of the POST request that sends user's email and password to the `https://example.com/login` endpoint.

```javascript
try {
  const response = await axios.post("https://example.com/login", {
    email: "goku@capsule.corp",
    password: "kamehameha"
  });

  // get the auth token
  const { data: { token } } = reponse;
} catch(err) {
  if (err.response) {
    // the server responded with a status code outside the 2xx range
    // handle HTTP errors
    console.log(`HTTP error: ${err.response.status}`);
  } else if (err.request) {
    // the request was made but no response was received
    // handle network errors
    console.log(err.request);
  } else {
    // request not sent, most likely a configuration or coding error
    console.log('Error', err.message);
    // best to re-throw such errors and crash
    throw new Error(err);
  }
}
```

`axios.post()` returns a promise that resolves to the [Response object instance](https://axios-http.com/docs/res_schema). The contents of the HTTP response's body is available in the `data` property. It's already JSON parsed so we can use read out `token` value directly from the `response.data` property.

The `axios.post(url, data)` method is a convenient shortcut for:

```javascript
axios({
  method: 'post',
  url,
  data,
});
```

The object we pass into to `axios()` function is called the Request Config. You can find all the request configuration options in the [Axios Docs](https://axios-http.com/docs/req_config).

#### Error handling 
If there was an error Axios with return a rejected promise so we can use `.catch()` callback or `await` with try/catch block to handle errors.

By default the response promise will be rejected if HTTP status code is not between 200 and 299. This behavior can be altered using the `validateStatus` request config option.

<!-- TODO: rewrite -->
```javascript
axios.get('/user/12345', {
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  }
})
```


#### Interceptors


<!-- TODO: add Axios example with interceptors and explain -->
https://axios-http.com/docs/interceptors

Axios comes with 5.6 extra kilobytes, so if you'd like something more lightweight check out [Redaxios](https://github.com/developit/redaxios). It is a leaner version of Axios by [Jason Miller](https://github.com/developit) - the author of Preactjs. Redaxios strives to offer most of the Axios functionality but will much smaller size (around 1 kB), partly thanks to use the native Fetch API. Not all core Axios features are implemented yet however, most notably the interceptors (see the [Github issue](https://github.com/developit/redaxios/issues/9) for details).

### Superagent

https://github.com/visionmedia/superagent

You might be familiar with superagent if you wrote some E2E REST API tests in Node.js. Many developers use a popular [supertest](https://github.com/visionmedia/supertest) library for testing Node.js HTTP servers. It's a thin wrapper around superagent that makes it easier to make request against the `http.Server` instance and includes a bunch of utility methods to make assertions against the responses. I've used it a lot to test REST API written in Express and it was great. Very easy to block-box test your API endpoints by sending a test request and checking if the response is what you'd expect.

### Ky

https://github.com/sindresorhus/ky

```javascript
import ky from "ky";

const data = { email: "goku@capsule.corp", password: "kamehameha" };

const { token } = await ky
  .post("https://example.com/login", { json: data })
  .json();
```

### jQuery

<!-- TODO: Rewrite as reason behind jQuery -->
<!-- probably the most obvious difference is how to get an XMLHttpRequest in the first place:

var xhr;
if (window.XMLHttpRequest) {
   xhr = new XMLHttpRequest(); // Mozilla/Webkit/Opera
} else if (window.ActiveXObject) {
   xhr = new ActiveXObject('Msxml2.XMLHTTP'); // IE
} else {
   throw new Error('Ajax likely not supported');
}
that being said, i'd strongly look into an abstraction library such as jQuery. it makes things like ajax ridiculously easy:

$('#container').load('/ajax/resource'); -->



Old but still used, included by default in Wordpress.

If you have used jQuery long time ago you might be familiar with `$.ajax`, `$.get` and `$.post()` methods and handling asyncronous requests via callbacks like so:

```javascript

```

However since jQuery 1.5 (released around 2011), these methods support the Promise API, which means we can use a modern async/await syntax. Let's look at how our login post request example would look in jQuery:

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

try {
  const { token } = await $.post("https://example.com/login", data);
  // use the token
} catch (err) {
  // handle network and HTTP errors
  console.log(err.status); // HTTP status code
  console.log(err);
}
```

Pretty nice I'd say. If you have jQuery already as a dependecy it's actually pretty good for sending HTTP requests. However, I'd advice againts adding it just for this purpose, as it comes with around 30 kB gzipped baggade (https://bundlephobia.com/package/jquery@3.6.0). You'd be much better of using Fetch API or some lighter libraries we talked about earlier.

### request and request-promise

Deprecated!

The request is a Node.js module, which together with it's promise enabled request-promise twin were once a very popular option for sending HTTP requests. In fact, it was so nice that many people used it in the browser enviorments via browserify. Since the project is no longer maintained and has been deprecated I'd advise againts using it in any new projects. However, due to it's popularity in the recent past you are quite likely to came across it on some projects.

A basic example of using tthe request module to send a POST request to a `/login` API endpoint looks like that:

```javascript
const request = require('request');
request("https://example.com/login", function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
```

As you can see, the request package uses the old-fashioned callback based design. However, the request-promise package can be used instead to allow for more modern Promise-based design.

Similar `/login` POST request using the Promise API of the request-promise module:
```javascript

```

## Summary

// TODO
Axios // Mon
Superagent // Tue
Ky // Wed
Jquery + request // Thu
Summary + initial 3rd part libs section // Fri
Editing of whole // Fri
