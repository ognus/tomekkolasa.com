---
title: How to check if an object is empty in JavaScript
description: There are so many ways to check if an object is empty in JavaScript. Not sure which one to use? In this post, I provide a detailed explanation of the most commonly used methods to check if an object is empty, and also compare their performance.
date: 2020-07-10 11:00
---

In programming, there are many ways to solve a problem. Even something basic like checking if an array or object is empty has several ways to go about it. JavaScript is not an exception.

Let’s have a look at some of the popular ways to check if the object is empty in JavaScript.

## Using Object.keys()

```javascript
const isMyObjectEmpty = Object.keys(myObject).length === 0;
// or, (!0 is coersed to true)
const isMyObjectEmpty = !Object.keys(myObject).length;
```

We can use the `Object.keys()` method to check if there are any properties defined in an object.

It returns an array of object's own keys (or property names). We can use that array to check if it's length is equal to `0`. If it is, then it means the object has no properties. It's empty.

It's a great way of checking if an object is empty. It's easy to use, short, and easy to understand what the code is doing.

We could also use `Object.values()` or `Object.entries()` to achieve the same result.

`Object.values()` returns an array of the object's property values. Not property names like the `Object.keys()`.

`Object.entries()` on the other hand, returns an array of object's `[key, value]` pairs.

For our use case here, the `Object.keys()` is the simplest choice. Furthermore, it’s faster than `Object.values()` and `Object.entries()` ([benchmark results](#performance-comparison)).

## Using Lodash

```javascript
// npm install lodash
import _ from "lodash";

const isMyObjectEmpty = _.isEmpty(myObject);
```

Another simple and easy way to check if an object is empty is to use the `_.isEmpty()` method. It's part of the Lodash (and Underscore.js) utility library.

It works with JavaScript primitives and data types as well, not only plain objects like the `Object.keys()` we discussed before.

```javascript
_.isEmpty(""); // true
_.isEmpty([]); // true
_.isEmpty({}); // true
_.isEmpty(null); // true
_.isEmpty(undefined); // true
_.isEmpty(Number.NaN); // true
_.isEmpty(0); // true
```

The drawback is that you need to include the Lodash library. This might not be what you want. For instance, you might prefer to save some of those precious kilobytes that are loaded by the browser.

Yet, in most cases, it doesn't make a great deal of a difference. I wouldn't worry about that prematurely.

Lodash is very popular, and many libraries use it as a dependency. When you work in a team, someone will include it sooner or later. Check it out if you haven't had the chance yet.

## Using a for-in loop

```javascript
function isObjectEmpty(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}

const isMyObjectEmpty = isObjectEmpty(myObject);
```

Here we created our own utility function `isObjectEmpty()` which we can use to check if an object is empty.

This is also a nice solution. The `isObjectEmpty` name makes the purpose of the function clear.

Moreover, the implementation is also easy to understand.

We loop through all object properties (own and inherited) using a `for-in` loop. On each iteration we call the object's `.hasOwnProperty()` method. We use it to check if the property actually belongs to this object and not to one of its ancestors up the prototype chain. If it belongs, we already know the object is not empty. So the function returns `false`. In a case when there are no properties or none of them belong to the object, the function returns `true`.

Interestingly enough, our custom `isObjectEmpty` function is implemented almost exactly like the `_.isEmpty` method. Have a look at the [Lodash's source code](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11495-L11500).

## Using JSON.stringify()

```javascript
const isMyObjectEmpty = JSON.stringify(myObject) === "{}";
```

`JSON.stringify()` is often used to check if an object is empty.

Yet, I wouldn't recommend using it this way. I will explain the reasons behind that, but first, let's see how it works.

`JSON.stringify()` converts an object to it's JSON string representation.

If the object is empty we'll always get a `"{}"` JSON string as a result. If the object is not empty, the JSON string will contain all its properties.

For example, calling `JSON.stringify({ myProperty: "myValue" })` will return `'{"myProperty":"myValue"}'`.

Why not use it though?

- Converting an object to a string, just to check if it's empty, feels over-the-top.
- It might yield unexpected results. By default `JSON.stringify()` ignores properties with the `undefined` or Symbol as a value.
- It's slower than other methods ([benchmark results](#performance-comparison)).

Let have a look at example of unexpected result of the `JSON.stringify()` method:

```javascript
const myObject = { value: undefined };

Object.keys(myObject).length === 0;
// false

JSON.stringify(myObject) === "{}";
// true
```

In this case, test object contains one property of value `undefined`. It's not empty. Yet, the `JSON.stringify({ value: undefined }) === "{}"` check returns `true`.

## Other alternatives

### jQuery

```javascript
const isMyObjectEmpty = jQuery.isEmptyObject(myObject);
```

We don't talk that much about jQuery in recent years, but it's still a decent library. It's simple to learn and it's included by default in WordPress.

It used to be very popular. I'm sure there are still many older websites that you might end up working on.

So if you happen to use jQuery, `jQuery.isEmptyObject()` is a good option.

Its implementation is just like Lodash `_.isEmpty()` and our custom `isObjectEmpty()` function. It iterates over object properties using a for-in loop.

The difference is, ‘jQuery.isEmptyObject()’ doesn't call `hasOwnProperty()`. So it checks not only the object’s own properties but also all the properties up the prototype chain. You can have a look at it in the [jQuery source code](https://github.com/jquery/jquery/blob/3.x-stable/src/core.js#L239-L246).

### Not checking if the object is empty

Sometimes we can achieve what we need without checking if the whole object is empty.

For example, it could be enough to check for a specific property (`const isEmpty = !obj.myProp`). If we know this property should exist in a non-empty object, we're good to go.

Another use case for establishing if an object is empty is using objects as a dictionary (or map).

We sometimes need to check if the object is empty to know if there are any items in our dictionary. We can use `Object.keys(myDict).length` to get the size of the dictionary and check if it’s empty (`=== 0`).

However, using an actual [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) data structure might be a better option. Especially, if you need to preserve the order of inserted elements. This way we can check if our map is empty by using its `size` property:

```javascript
const map = new Map();

const isEmpty = map.size === 0;
```

## Performance comparison

Now, as a bonus, let's compare the execution times of all the above ways of determining if an object is empty.

I have prepared a simple benchmark at [JSBench](https://jsbench.me/7xk9xur7cf/1). It checks an empty and non-empty object on each iteration.

Let's have a look at the results when running the benchmark on the Chrome and Firefox browsers.

The tables below show the benchmark results on the Chrome and Firefox browsers. They include a number of operations per second for each method and its speed in relation to the fastest solution.

**CHROME (Version 83.0.4103.116 (Official Build) (64-bit)):**

| Method                   |               Operations |        Result |
| ------------------------ | -----------------------: | ------------: |
| `isEmptyObject()`        | 78,449,016 ops/s ± 0.44% |       fastest |
| `jQuery.isEmptyObject()` | 37,488,633 ops/s ± 0.53% | 52.21% slower |
| `Object.keys()`          | 29,604,851 ops/s ± 1.84% | 62.26% slower |
| `Object.values()`        |  9,144,806 ops/s ± 0.31% | 88.34% slower |
| `_.isEmpty()`            |  7,275,511 ops/s ± 0.59% | 90.73% slower |
| `Object.entries()`       |  4,921,672 ops/s ± 2.32% | 93.73% slower |
| `JSON.stringify()`       |     199,118 ops/s ±0.69% | 99.75% slower |

<br/>

**FIREFOX (77.0.1 (64-bit)):**

| Method                   |               Operations |        Result |
| ------------------------ | -----------------------: | ------------: |
| `jQuery.isEmptyObject()` | 44,447,322 ops/s ± 1.11% |       fastest |
| `isEmptyObject()`        | 38,838,025 ops/s ± 0.34% | 12.62% slower |
| `_.isEmpty()`            |  6,232,845 ops/s ± 0.65% | 85.98% slower |
| `Object.keys()`          |  3,157,550 ops/s ± 0.49% | 92.90% slower |
| `Object.values()`        |  2,663,671 ops/s ± 0.42% | 94.01% slower |
| `Object.entries()`       |    726,412 ops/s ± 0.37% | 98.37% slower |
| `JSON.stringify()`       |    279,842 ops/s ± 0.43% | 99.37% slower |

I have also tried Edge and Safari browsers. The results were similar to the Chrome browser, so I didn't include them to keep it simple.

We can see that `JSON.stringify()` is significantly slower than the other methods. If the object is not empty then it needs to be converted to a String in its entirety. The bigger the object gets, the more time the conversion will take.

Other than that, we can see that the methods using a `for-in` loop tend to perform better. Either the `jQuery.isEmptyObject()` method or our custom implementation `isObjectEmpty()` is the fastest.

Lodash's `_.isEmpty()` also uses a `for-in` loop. Since it's a more generic solution (not only for objects), it does a bunch of extra checks, which make it a bit slower.

`Object.keys()` still performs really well, especially in Chrome. It’s faster than `Object.values()` and `Object.entries()`, and it’s usually my first choice when I need to check if an object is empty.

Let me know which method of checking if an object is empty you use the most and why?
