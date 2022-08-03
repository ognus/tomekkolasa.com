---
title: Good and bad uses of JSON.stringify() and JSON.parse() in JavaScript
---

Examples of how and how not to use `JSON.stringify()` in your JavaScript code.

## Good uses

This is mostly examples.

### Logging and debbuging

Since `JSON.stringify()` converts objects to strings it's really great for serializing data to save it to a file, send over network or print to the console. With the addition on pretty-printing the JSON output it makes it a great tool for logging and debbuging.

Some developers prefer to use a debbuger, but I'm sure even they sometimes resolve to a quick `console.log` call.
The `console.log()` method outputs a message to the web console in case of the browser or to the standard output in case of Node.js. The message can be a string or objects.

But how does it print the objects you might ask? The default object `.toString()` implementation gives us just that for any custom object we create `"[object Object]"`. Clearly that's not good.

#### Browser web console

Fortunatelly, the `console.log()` we use for debbuging is not as simple as to call `.toString()` and output it as a string.
In the web console (like the one in Chrome Dev Tools) it will print a nice collapsible output where you can drill down to see the object's properties:
<!-- [TODO]: screenshot -->

Nice! however, you must know that the `console.log()` output presented in the browser's web console is dynamic. It will update each time the message changes, which is often not what you'd want, as we usually want to see the value of object was had at the moment we logged it.

<!-- [TODO]: screenshot with live view action -->

We can fix this problem by using `JSON.stringify()`, but first lets have a look at another place you can use `console.log()` beside brwoser's web console: Node.js.

#### Node.js

Node.js doesn't have this feature as `console.log()` just print to standard output on your system terminal. Thus we won't get such an elegant output as in the browser console, but also we won't face the problem of output changing. However, Node's `console.log()` has it's own limitation: 

```javascript
const object = { a: { b: { c: { d: { e: 1 } } } } };

console.log(object);
// { a: { b: { c: [Object] } } }
```

As you can see there is a limit on how deep it can go. If you try to console log a complex object that has nexted objects and arrays with other objects than a simple `console.log()` might not be enough. This is where `JSON.stringify()` comes in. If you convert the whole object to a JSON string, the `console.log()` will just dump it to the screen with no problems.

```javascript
console.log(JSON.stringify(object));
// {"a":{"b":{"c":{"d":{"e":1}}}}}
```

#### Pretty-printing

We can make it more readible by using the `JSON.stringify()` space parameter:

```javascript
JSON.stringify(value[, replacer[, space]])
```

Let's pass in `2` spaces as a 3rd parameter to make the JSON output nicely intended and easy to read . We need to skip the 2nd parameter which is for the custom replacer function.

```javascript
console.log(JSON.stringify(object, null, 2));
// {
//   "a": {
//     "b": {
//       "c": {
//         "d": {
//           "e": 1
//         }
//       }
//     }
//   }
// }
```

If you want to learn more about **JSON.stringify** and **JSON.parse**'s custom parameters like the **space**, **replacer** and **reviver** see the post on [How to use optional parameters in JSON.stringify and JSON.parse](/how-to-use-optional-parameters-in-json-stringify-and-json-parse).

#### Circular structure error

Are there any short-commings to using `console.log(JSON.stringify(object, null, 2))` beside it being obscenly long? Well, there is one gatcha. `JSON.stringify()` does not work by default with cyclic references. When an object you're trying to stringify contains a property that references this same object if will explode with the **Converting circular structure to JSON** TypeError:

```javascript
const object = {};
object.a = object;
JSON.stringify(object);
// Uncaught TypeError: Converting circular structure to JSON
```

Solution? In general you can try to write your own **replacer** function (see how here) but for debbuging purposes it's an overkill. You can resolve to using `console.log(object)`. The browser's web console will display that with no problems. In Node.js `console.log(object)` also works fine if don't need to see any deep nested properties values.

```javascript
const object = { a: { b: { c: { d: 1 } } } };
object.e = object;
console.log(object)
// <ref *1> { a: { b: { c: [Object] } }, e: [Circular *1] }
```

Alternativelly, you can still use `console.log(JSON.stringify(object))` but need to break the cycle in the `object`. For example by using destructuring to print only a part of the object, or by cloning the object and removing the cyclic reference etc.

The `JSON.stringify()` method is not only great when used with `console.log()` for debugging but also for sending logs to the server, or any HTTP requests for that matter. Let's have a look.

### HTTP requests and responses

Requests sent to a server are just plain text messages. They follow special format prescribed by the HTTP protocol, but are just text. Because of that the data we send in the message body needs to be text as well. And this is where `JSON.stringify()` comes in handy.

#### XMLHttpRequest

Until fairly recently the only way to send requests to the browser without page reload (so called AJAX requests) was to use the XMLHttpRequest object. Let's have a look at a POST request example that sends user's email and password to the `https://example.com/login` endpoint.

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
} 

// prepare and send the request
xhr.open('POST', 'https://example.com/login');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(json));
```

As you can see we use `JSON.stringify()` to convert our login data object to JSON string to send it as an AJAX request. Similarly we then use `JSON.parse()` to convert the response text in JSON format from the server to a JavaScript object.

XMLHttpRequest is not the nicesest to work with so you might not see it too often in the wild. Over the years, many external libraries provided easier to use wrappers around the XMLHttpRequest object, for example `jQuery.post()` or `axios.post()`.

#### Fetch API

Fortunatelly, nowadays we can use the Fetch API. It is a replacement for the XMLHttpRequest object and was initially supported by Chrome and Firefox browsers as early as 2015. It's a modern API that relies on promises instead of callbacks and it's much nicer to use. Since around 2017 it has been widely adopted across all modern browsers.

Let's have a look at the example. Similarly to XMLHttpRequest we convert our data to JSON string using `JSON.stringify()`. We don't need to use `JSON.parse()` ourseleves as that already handled by the Fetch API in `response.json()`.

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

Why this is much nicer? Imagine you'd want to wrap it a reusable function, like let's say `login(email, password)`. With `xhr.onload` we need to wrap the token response in a promise or use a callback. Using Fetch API we can already use the token in synchronous fashion by leveraging the modern async/await syntax. It'd also allow for sepperating error handling easier rather than using callbacks.


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

Is there any reason to use XMLHttpRequest API today? I would say, generally no. Fetch API is much easier to use and is equally powerful. Unless you need to support old browsers like IE11, but even then you can use fetch polyfill (TODO: add some link) or an external library like axios.

#### Making HTTP requests with Node.js

In Node.js, you can use the build-in `http` (or `https`) client to make an HTTP(S) requests. The `http` module API uses Node's stream interface, which makes is very convenient when working with other steam-enabled SDKs like for example file access for downloading or uploading files. However, it feels quite verbose when all we need is a simple POST request.

Similarly to when using the XMLHttpRequest object in the browser we'll need to use `JSON.stringify()` to convert the object data to a JSON string we'll be sending in a POST request. We'll also use `JSON.parse()` to parse the JSON string from the server's response into an object so we can read the `token` value.

Let's have a look at the example:


```javascript
const https = require("https");

const data = { email: "goku@capsule.corp", password: "kamehameha" };

const url = new URL("https://example.com/login");
const options = {
  headers: { "Content-Type": "application/json" },
}

const req = https.request(url, options, response => {
  let responseData = "";
  response.on("data", chunk => {
    // drain the stream data into a string, so we can parse it later
    responseData += chunk;
  });
  response.on("end", () => {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      // get JSON to get to the auth token
      const { token } = JSON.parse(responseData);
    } else {
      // handle HTTP errors
      console.log(`HTTP error: ${response.statusCode}`);
    }
  });
});

req.on("error", err => {
  // handle network errors
  console.log(err);
})

req.write(JSON.stringify(data));
req.end();
```

Fairly verbose right? Because of that most Node.js developers use external libraries that are much easier to use, like axios or node-fetch. My preference is usually node-fetch as it brings the same Fetch API we can use in the browser into Node.js.

Most libraries will internally call JSON.stringify() and JSON.parse() for you. This is also the case with many Database clients like ps-node for PosgresSQL and mongodb for MongoDB. So you usually don't have to worry about it.

### Local storage and session storage

The Web Storage API provides a way to store key/values pairs in the browser so that we can persist values through page loads. There are two stores available that we can read from and write to:

- **sessionStorage**, which presist values across page reloads in a browser tab. If the tab or the whole browser is closed the session storage is cleared  
- **localStorage** also allows to save page specific data, but persists it even when the browser is closed.

Both `localStorage` and `sessionStorage` are accessed as simple key-value stores. To set a value we use the `setItem(key, value)` method and to read a value we use `getItem(key)`. Much like using a Map. For example:

```javascript
// save the value in local storage
localStorage.setItem("user", "Eren Yēgā");
// read the value
localStorage.getItem("user");
// "Eren Yēgā"
```

Very simple. However, to store arrays and objects we need to convert them to a string. For that we can use `JSON.stringify()`. Similarly to convert the string value back to the object we'd use `JSON.parse()` like so:

```javascript
const user = { name: "Eren Yēgā", age: 19 };

// convert user object to JSON string representation and store it
localStorage.setItem("user", JSON.stringify(user));

// retrieve the JSON string value and parse it
JSON.parse(window.localStorage.getItem("user"));
// { name: "Eren Yēgā", age: 19 }
```

## Bad uses

Not necesairly bad, but be careful with those use cases. Most of them are either unusal ways to use 

### Deep cloning

You can make a copy of an object in JavaScript by first converting it to a JSON string with `JSON.stringify()` and then converting the JSON back to JavaScript object with `JSON.parse()` like so:

```javascript
const deepCopy = JSON.parse(JSON.stringify(object));
```

However, be careful! Using `JSON.parse(JSON.stringify(object))` has some unobvious gotchas like some properties not being copied over, or not being handled as expected. Most notably functions, symbols, `Date` objects, `undefined`, `Infinity`, `NaN` and regex values. But also data structures like maps, sets, array buffers and typed arrays (e.g. `Uint8Array`). It's also worth to note that object instances like `String` and `Boolean` with be converted to their primitive values counterparts, which might not be always what you want. See how `JSON.stringify()` handles different values on [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description) for more details.

As a good rule of thumb, using `JSON.parse(JSON.stringify(object))` to clone objects only works as expected for plain JavaScript objects, where all the values are primitve types of other simple boejcts and arrays that only contain primitive values and simple objects and arrays. This is often the case when working with HTTP responses or results of Database querries.

If you need a deep copy of an object it's much safer to use Lodash's `_.cloneDeep(obj)`. It can properly copy:

- `Boolean`, `String` and `Date` objects
- `Number` objects (specifically `NaN` and `Infinity` values)
- symbols
- regexes
- maps
- sets
- array buffers and typed arrays

Notice however that this still won't copy functions.

If you're working on Nodejs (8 and above) code then you can use the Serialization API instead Lodash `_.cloneDeep()` function. Both implement the [Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) so should work in similar way.

```javascript
const v8 = require("v8");

const deepCopy = v8.deserialize(v8.serialize(object));
```

Finally, make sure you really need a deep copy, as maybe a shallow copy of object's properties would be enough for your use case:

```javascript
const shallowCopy = {...object}; // same as = Object.assign({}, object)
```

The above will only the immediate properties of the object, so if one of the properties is an array for example the new cloned object will reference the same array (only the value of reference points to the array will get copied, not what's inside the array).

### Deep object comparison

Checking if a particular object instance has exactly the same properties and values as another object isnatce is not something you'd need to do very often. However, it comes really in handy when writing tests.

You might be tempted to use `JSON.stringify()` for quick and easy deep object comparison. Something like:

```javascript
function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
```

However, beside the same gothas like deep cloning there is yet another problem. Since we just compare strings the order or objects' properties matter. In fact, the comparison will always return `false` unless both object' properties are in the exact same order. So the only time this works as expected is if you are working with plain, JSON-serializable JavaScript objects and both object's properties are in the same order. But as you probably know the order of properties is not a characteristic objects care about. Objects usually retain the order in which the properties were created (or added) due to implementation detail and a particular order is not guaranteed.

Because of all these problems it's best to avoid using `JSON.stringify()` for deep object comparison. It's better to use Node's `assert.deepStrictEqual()` or an assertion library like Chai. Most testing framework have same assertion library already included or provide their own.

### Converting other data types to string

Turns out that you can use `JSON.stringify()` to convert most of the values to their string representation, not only objects. 
We might use it because it works with all the primitive types, arrays and ofcourse objects. Thus making it quite convenient when you want to convert a value to string without checking the value's type or if the value is defined. Might be useful for some kind of database or file exports, serialisation, logs etc., when you just want to dump the values there without any processing.

```javascript
JSON.stringify(44); // "44"
JSON.stringify(true); // "true"
JSON.stringify(null); // "null"
JSON.stringify(undefined); // "undefined"
JSON.stringify([0, 1, 1, 2, 3]); // "[0,1,1,2,3]"
```

In most cases of everyday coding however, you usually know the type (or possible types) of the value. Thus, there are better alternatives. For example, using `.toString()`, it works for most primitives, beside `null` and `undefined`, as well as arrays.

```javascript
Number(44).toString(); // "44"
Boolean(true).toString(); // "true", true.toString() works a well
[0, 1, 1, 2, 3].toString() // "0,1,1,2,3", notice no brackets here
```

Using the `String` constructor is also a good option if you don't want to check for `null` and `undefined` values.

```javascript
String(44); // "44"
String(true); // "true"
String(null); // "null"
String(undefined); // "undefined"
String([0, 1, 1, 2, 3]); // "0,1,1,2,3"
```

When using the `.toString()` method or the `String` constructor on the array however, notice that it does not include the `[]` brackets in the output string like `JSON.stringify()`. So if you'd want the brackets you'd have to handle the array type specifically:

```javascript
if (Array.isArray(value)) {
  return `[${value.toString()}]`; // value.join(",") also works great
}
```

### JSON.parse performance hack

For large data it's actually faster to specify it as JSON string not JavaScript object. At least in Chrome.

```javascript
// slower
const largeData = [{ id: 1, data: { ... } }, ...];

// faster
const largeData = JSON.parse('[{"id":1,"data":{...}},...]');
```

https://www.youtube.com/watch?v=ff4fgQxPaO0
