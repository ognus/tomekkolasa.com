---
title: How to make HTTP requests in pure JavaScript. Using Fetch vs XMLHttpRequest.
---

In this post we will go through most of the ways you can send HTTP requests from the JavaScript code, both in the browser and the NodeJS runtime. We'll have a deeper look at each one of them, where I'll explain the code examples and discuss the pros and cons of the solution.

We'll use a similar POST request example with basic error handling so you can compare the different ways. I will also try to show examples of some of the unique things about these ways.

## Using pure JavaScript

Why use pure JavaScript.

Adding libraries comes with a cost.

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

<!-- Mention on tracking request progress via onprogres and how to cancel the request -->

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

```javascript
const request = new Request('https://example.com', {method: 'POST', body: '{"foo": "bar"}'});
await fetch(request);
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

<!-- Mention that it's not east to track progress using Fetch, hope here:? https://github.com/whatwg/fetch/issues/607 -->

Fetch API integrates well with modern web workers browser APIs especially related to offline experience like Service Workers API and Cache API. Even though XMLHttpRequest can be used in Web Workers, it's not aviailable in Service Workers API. Usage of the Cache API is also easier with fetch, as you can pass Request objects directly to the Cache.

<!-- about multipart/form-data and FormData -->