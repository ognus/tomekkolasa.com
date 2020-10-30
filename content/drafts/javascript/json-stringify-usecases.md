---
title: Good and bad uses of JSON.stringify() and JSON.parse() in JavaScript
---

Examples of how and how not to use `JSON.stringify()` in your JavaScript code.

## JSON.stringify()

The `JSON.stringify()` method converts a value to it's JSON string representation. Most commonly used to convert a JavaScript object into a JSON string. You can also pass primitive values like numbers or booleans and they will be converted to strings.

Beside `value`, the method also accepts two optional parameters:

`JSON.stringify(value[, replacer[, space]])`

Let's have a look at some examples how to use the `replacer` and `space` arguments.

### replacer - a custom JSON serializer

When calling `JSON.stringify()` you can pass a function as a second argument. The function allows you to modify how `JSON.stringify()` converts a value into string.

To mimic the default behaviour of `JSON.stringify()`, our custom replacer function would look somehing like that:

```javascript
JSON.stringify(object, (key, value) => {
  return value;
});
```

But, let's have a look at some more interesting example. We will use the custom replacer function to "hide" the value of a `password` property of the object we pass in.

```javascript
const user = { email: "goku@capsule.corp", password: "kamehameha" };

JSON.stringify(user, (key, value) => {
  // if property name is "password" hide the real value
  if (key === "password") {
    return "***";
  }
  // othwerwise, proceed as normal by returning the property's value
  return value;
});
// "{"email":"goku@capsule.corp","password":"***"}"
```

Turns out that a function is not the only value we can pass in the second argument. It also accepts an array of String and Number values that we can use to specify which properties of the value object will be included in the resulting JSON string.

```javascript
const user = {
  email: "goku@capsule.corp",
  username: "kakarotto",
  password: "kamehameha",
};

JSON.stringify(user, ["email", "username"]);
// "{"email":"goku@capsule.corp","username":"kakarotto"}"
```

### toJSON()

We can also customize the `JSON.stringify()` on per object basis. If an object contains a method `toJSON()`, it's return value will be converted to JSON string, instead of the whole object value.

It's yet another way we can use to alter the way object properties are stringified or exclude unwanted properties. This time however, we can encapsulate this logic within our object if we like to.

Let's have a look at the example.

We create a `Credentials` instance which contains user's email and password. We implement a `toJSON` method to not include the password field in the JSON string, unless our user instance itself is a value of property named `data`. This could be useful when we send the user object as a body of a HTTP POST request. If we wrapped it with an object with property `data` if will contain much need `password` field.

```javascript
class Credentials {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  toJSON(key) {
    if (key === "data") {
      return this;
    }

    return { email: this.email };
  }
}

// Using class is just an example.
// toJSON() will also work with object literal syntax as well
const user = new Credentials("joe@user.com", "secret");

JSON.stringify(user);
// "{"email":"joe@user.com"}"

JSON.stringify({ data: user });
// "{"data":{"email":"joe@user.com","password":"secret"}}"
```

### Intendation

```javascript
const user = {
  name: "Son Gokū",
  profile: {
    height: 175,
    occupation: "farmer",
  },
};

JSON.stringify(user, null, "🍉");
// {
// 🍉"name": "Son Gokū",
// 🍉"profile": {
// 🍉🍉"height": 175,
// 🍉🍉"occupation": "farmer"
// 🍉}
// }

JSON.stringify(user, null, "|  ");
// {
// |  "name": "Son Gokū",
// |  "profile": {
// |  |  "height": 175,
// |  |  "occupation": "farmer"
// |  }
// }
```

## JSON.parse()

The `JSON.parse()` method converts a JSON string to plain JavaScript object or value.

```javascript
JSON.parse(text[, reviver])
```

We can use the optional `reviver` function to filter or alter object properties before it's returned. I don't use it that ofthen, because it doesn't provide any performance. The object is already transformed



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

### JSON.parse performance hack

For large data it's actually faster to specify it as JSON string not JavaScript object. At least in Chrome.

```javascript
// slower
const largeData = [{ id: 1, data: { ... } }, ...];

// faster
const largeData = '[{"id":1,"data":{...}},...]';
```

https://www.youtube.com/watch?v=ff4fgQxPaO0
