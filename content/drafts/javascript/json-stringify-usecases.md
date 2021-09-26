---
title: Good and bad uses of JSON.stringify() and JSON.parse() in JavaScript
---

Examples of how and how not to use `JSON.stringify()` in your JavaScript code.

## Good uses

This is mostly examples.

### Logging and debbuging

.toString() -> `"[object Object]"`

```javascript
JSON.stringify(
  { name: "Son Gokū", occupation: "farmer", height: 175 },
  null,
  2
);
// { name }
```

```javascript
const object = { a: { b: { c: { d: { e: 1 } } } } };

console.log(object);
// { a: { b: { c: [Object] } } }

console.log(JSON.stringify(object));
// {"a":{"b":{"c":{"d":{"e":1}}}}}

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

### Local storage

```javascript
const user = { name: "Eren Yēgā", age: 19 };

// convert user object to JSON string representation and store it
localStorage.setItem("user", JSON.stringify(user));

// retrieve the JSON string value and parse it
JSON.parse(window.localStorage.getItem("user"));
// { name: "Eren Yēgā", age: 19 }
```

### HTTP requests and responses

XMLHttpRequest

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

const xhr = new XMLHttpRequest();

xhr.onload = () => {
    // print JSON response
    if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
    }
};

// prepare and send the request
xhr.open('POST', 'https://example.com/login');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(json));


```

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

const response = await fetch("https://example.com/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const { token } = await response.json();
```

In Node, you can use the build in `http` client, but in most cases we use external libraries that are much easier to use, like axios or node-fetch.

Most libraries will internally call JSON.stringify() and JSON.parse() for you. This is also the case with many Database clients like ps-node for PosgresSQL and mongodb for MongoDB. So you usually don't have to worry about it.

## Bad uses

Not necesairly bad, but be careful with those use cases.

### Deep cloning

it's better to use Lodash's `_.cloneDeep(obj)`, as using `JSON.parse(JSON.stringify(obj))` has some unobvious gotchas like some properties not being copied over, most notably functions, `undefined` value, `Date` object, and `Infinity` value. It works as expected just for plain JavaScript objects. If you really, really want to use it, please be careful :)

### Deep object comparison

it simply doesn't work unless both object's properties are in the same order. Back in the day I used to use it to compare test results but I had to sort the properites. Silly of me :) It's better to use Node's `assert.deepStrictEqual()` or any modern assertion libraries.

### Converting other data types to string
you can use `JSON.stringify()` to convert most of the values to their string representation, much like when converting whole object, some of it's properties are converted to string.

```javascript
JSON.stringify(44); // "44"
JSON.stringify(true); // "true"
JSON.stringify(null); // "null"
JSON.stringify(undefined); // "undefined"
JSON.stringify([0, 1, 1, 2, 3]); // "[0,1,1,2,3]"
```

Better to use...

### JSON.parse performance hack

For large data it's actually faster to specify it as JSON string not JavaScript object. At least in Chrome.

```javascript
// slower
const largeData = [{ id: 1, data: { ... } }, ...];

// faster
const largeData = '[{"id":1,"data":{...}},...]';
```

https://www.youtube.com/watch?v=ff4fgQxPaO0
