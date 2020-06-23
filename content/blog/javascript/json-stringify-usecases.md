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
  password: "kamehameha"
};

JSON.stringify(user, ["email", "username"]);
// "{"email":"goku@capsule.corp","username":"kakarotto"}"
```

### toJSON()

We can also customize the `JSON.stringify()` on per object basis. If an object contains a method `toJSON()`, it's return value will be converted to JSON string, instead of the whole object value.

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

```
> a = { a: { b: { c: {d: {e: 1}}}}}
{ a: { b: { c: [Object] } } }
> a
{ a: { b: { c: [Object] } } }
> console.log(e)
Uncaught ReferenceError: e is not defined
> console.log(a)
{ a: { b: { c: [Object] } } }
undefined
> console.log(JSON.stringify(a, null, 2))
{
  "a": {
    "b": {
      "c": {
        "d": {
          "e": 1
        }
      }
    }
  }
}
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

In Node, you can use the build in `http` client, but in most cases we use external libraries that are much easier to use, like axios or node-fetch.

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

const response = await fetch("https://example.com/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const { token } = await response.json();
```

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
