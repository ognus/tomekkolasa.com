---
title: How to check if an object is empty in JavaScript
description: Detailed explanation and comparison of different ways to check if an object is empty in JavaScript.
date: 2020-07-10 11:00
---

In programming, there are many ways to solve a problem. Even something basic like checking if an array or object is empty. JavaScript is not an exception.

Let’s have a look at some of the popular ways to check if the object is empty in JavaScript.

## Using Object.keys()

```javascript
const isMyObjectEmpty = Object.keys(myObject).length === 0;
// or, (!0 is coersed to true)
const isMyObjectEmpty = !Object.keys(myObject).length;
```

We can use the `Object.keys()` method to check if there are any properties defined in the object.

It returns an array of object's own keys (or property names). We can use that array to check if it's length is equal to `0`. If it is, then it means the object has no properties. It's empty.

It's a great way of checking if an object is empty. It's easy to use, short, and easy to understand what the code is doing.

We could also use `Object.entries()` or `Object.values()` to achieve the same result.

`Object.values()` returns an array of the object's property values. Not property names like the `Object.keys()`.

`Object.entries()` on the other hand, returns an array of object's `[key, value]` pairs.

For our use case here, the `Object.keys()` is the simplest choice. Furthermore, it seems to be faster then `Object.entries()` ([benchmark results](#performance-comparison)).

## Using Lodash

```javascript
// npm install lodash
import _ from "lodash";

const isMyObjectEmpty = _.isEmpty(myObject);
```

Another simple and easy way to check if an object is empty is to use the `_.isEmpty()` method. It's part of the Lodash (and Underscore.js) utility library.

It works with JavaScript primitives and data types as well. Not only plain objects like the `Object.keys()` we discussed before.

```javascript
_.isEmpty(""); // true
_.isEmpty([]); // true
_.isEmpty({}); // true
_.isEmpty(null); // true
_.isEmpty(undefined); // true
_.isEmpty(""); // true
_.isEmpty(Number.NaN); // true
_.isEmpty(0); // true
```

If you try that in a plain JavaScript, it might not be the behaviour you want or would expect:

```javascript
!""; // true
![]; // false, bacause references to objects coerce to true
!{}; // false
!null; // true
!undefined; // true
!Number.NaN; // true
!0; // true
```

The drawback is that you need to include the Lodash library. This might not be what you want. For instance, you might prefer to save some of those precious kilobytes that are loaded by the browser.

Yet, in most cases, it doesn't make a great deal of a difference. I wouldn't worry about that prematurely.

Lodash is very popular, and many libraries use it as a dependency. When you work in a team someone will include it sooner or later. Check it out if you haven't had the chance yet.

## Using for-in loop

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

We loop through all object properties (own and inherited) using a `for-in` loop. On each iteration we call the object's `.hasOwnProperty()` method. We use it to check if the property actually belongs to this object and not to one of its ancestors. If it does we already know the object is not empty. So we can return `false`. In a case where the are no properties or none belongs to the object we return `true`.

It's exactly how Lodash implements the `_.isEmpty` method. Or rather it's part that handles objects. Have a look at the [Lodash's source code](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11495-L11500).

## Using JSON.stringify()

```javascript
const isMyObjectEmpty = JSON.stringify(myObject) === "{}";
```

`JSON.stringify()` is often used to check if an object is empty.

Yet, I wouldn't recommend using it this way. I will explain the reasons behind that, but first, let's see how it works.

`JSON.stringify()` converts an object to it's JSON string representation.

If the object is empty we'll always get a `"{}"` string as a result. It's a JSON string representing an empty object `{}`. If the object is not empty, the JSON string will contain all its properties.

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

Out test object contains one property of value `undefined`. It's not empty. Yet, the `JSON.stringify({ value: undefined }) === "{}"` check returns `true`.

## Other alternatives

### jQuery

```javascript
const isMyObjectEmpty = jQuery.isEmptyObject(myObject);
```

We don't talk that much about jQuery is recent years, but it's still a decent library. It's simple to learn and it's included by default in WordPress.

It used to be very popular. I'm sure there are still many older websites that you might end up working on.

So if you happen to have jQuery included, `jQuery.isEmptyObject()` is a good option.

Its implementation is just like Lodash `_.isEmpty()` and our custom `isObjectEmpty()` function. It iterates over object properties using a for loop.

The difference is, it doesn't call `hasOwnProperty()`. So it checks all the object's properties. It's own properties and properties up the prototype chain. You can have a look at it in the [jQuery source code](https://github.com/jquery/jquery/blob/3.x-stable/src/core.js#L239-L246).

### Not checking if the object is empty

Sometimes we can achieve what we need without checking if the whole object is empty.

For example, it could be enough to check for a specific property (`const isEmpty = !obj.myProp`). If we know this property will always exist on non-empty object, we're good to go.

Another use case for establishing if an object is empty is using objects as a dictionary (or map).

We sometimes need to check if the object is empty to know if there are any items in our dictionary. We can use `Object.keys(myDict).length` to get the size of the dictionary and check if it’s empty (`=== 0`).

However, using an actual [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) data structure might be a better option. Especially, if you need to preserve the order of inserted elements. This way we can check if our map is empty by using it’s `size` property:

```javascript
const map = new Map();

const isEmpty = map.size === 0;
```

## Performance comparison

Let's compare the execution times of all the above ways of determining if an object is empty.

I have prepared a simple benchmark at [JSBench](https://jsbench.me/7xk9xur7cf/1). It checks an empty and non-empty object on each iteration.

Let's have a look at the results when running the benchmark on the Chrome and Firefox browsers.

The tables below show the benchmark results on the Chrome and Firefox browsers. They include a number of operations per second for each method and its speed in relation to the fastest solution.

**CHROME (Version 83.0.4103.116 (Official Build) (64-bit)):**

| Method                   |               Operations |        Result |
| ------------------------ | -----------------------: | ------------: |
| `isEmptyObject()`        | 76,655,475 ops/s ± 0.90% |       fastest |
| `jQuery.isEmptyObject()` | 36,420,344 ops/s ± 2.02% | 52.49% slower |
| `Object.keys()`          | 30,715,859 ops/s ± 0.97% | 59.93% slower |
| `_.isEmpty()`            |  6,820,592 ops/s ± 0.63% | 91.10% slower |
| `Object.entries()`       |  4,831,865 ops/s ± 0.26% | 93.70% slower |
| `JSON.stringify()`       |    214,802 ops/s ± 0.31% | 99.72% slower |

<br/>

**FIREFOX (77.0.1 (64-bit)):**

| Method                   |               Operations |        Result |
| ------------------------ | -----------------------: | ------------: |
| `jQuery.isEmptyObject()` | 44,815,790 ops/s ± 0.88% |       fastest |
| `isEmptyObject()`        | 37,644,762 ops/s ± 0.85% |    16% slower |
| `_.isEmpty()`            |  6,479,990 ops/s ± 0.84% | 85.54% slower |
| `Object.keys()`          |  3,049,767 ops/s ± 0.51% | 93.19% slower |
| `Object.entries()`       |    812,136 ops/s ± 0.48% | 98.19% slower |
| `JSON.stringify()`       |    231,561 ops/s ± 0.87% | 99.48% slower |

<!-- SAFARI:

| Method                   |                Operations |        Result |
| ------------------------ | ------------------------: | ------------: |
| `isEmptyObject()`        |  16,250,586 ops/s ± 0.43% |       fastest |
| `Object.keys()`          | 14,461,254 ops/s ± 28.56% | 11.01% slower |
| `jQuery.isEmptyObject()` |   6,627,786 ops/s ± 0.83% | 59.22% slower |
| `_.isEmpty()`            |   3,485,436 ops/s ± 1.19% | 78.55% slower |
| `Object.entries()`       |     435,051 ops/s ± 0.44% | 97.32% slower |
| `JSON.stringify()`       |     226,846 ops/s ± 0.49% |  98.6% slower |

EDGE:

| Method                   |               Operations |        Result |
| ------------------------ | -----------------------: | ------------: |
| `isEmptyObject()`        | 78,186,136 ops/s ± 0.62% |       fastest |
| `jQuery.isEmptyObject()` | 32,744,713 ops/s ± 0.40% | 58.12% slower |
| `Object.keys()`          | 31,369,467 ops/s ± 0.77% | 59.88% slower |
| `_.isEmpty()`            |  6,916,106 ops/s ± 0.53% | 91.15% slower |
| `Object.entries()`       |  4,806,957 ops/s ± 0.40% | 93.85% slower |
| `JSON.stringify()`       |    213,333 ops/s ± 0.29% | 99.73% slower | -->

I have also tried Edge and Safari browsers but the results were similar to the Chrome browser. So I didn't include them for clarity.

We can see that `JSON.stringify()` is significantly slower than other methods. If the object is not empty then it needs to be converted to a String in its entirety. This bigger the object the more time the conversion will take.

Other than that, we can see that the methods using a `for-in` loop tend to perform better. Either the `jQuery.isEmptyObject()` method or our custom implementation `isObjectEmpty()` is the fastest. Lodash's `_.isEmpty()` also uses a `for-in` loop, but since it's a more generic solution (not only for objects), it does a bunch of extra checks. Which makes it a bit slower.

So why the methods using `for-in` loop are the fastest?

### For-in loop vs Object.keys() performance

Well... just like in real life, this is a bit complicated 😉

But let's see if we can find something out. We will look into V8's internals a tiny bit to help us out. V8 is a JavaScript engine made by Google and used in Chrome and Node.js.

Generally, I'd expect the `Object.keys()` to outperform `for-in` loop in most cases. The reason is that `for-in` loop iterates over all property names so it needs to do a lookup up the prototype chain. This is not that case for `Object.keys()`, which returns just an object's own properties.

My guess is that the methods using the `for-in` loop are faster than `Object.keys()` because they have a constant time complexity of O(1). Whether an object is empty or not the loop will only run one iteration end exit immediately with `true` or `false`. This is not the case with other implementations. `Object.keys()` and `Object.entries()` will need to collect all the properties into an array.

In reality, both the `Object.keys()` method and a `for-in` loop share a common logic in the V8 implementation. They use the `KeyAccumulator` class to handle the collection of object's keys. It's designed to deal with different internal representations of a Javascript object.

Due to those complexities, looking through its source code is not the easiest. But some places like [this one](https://github.com/v8/v8/blob/8.6.58/src/objects/keys.cc#L551-L553) shed some light on why the `for-in` loop might be faster in some cases.

In this case, the `for-in` loop doesn't need to copy the array and can use an internal array (`EnumCache`) to fetch the keys.

Yet, the `for-in` based methods like our `isObjectEmpty()` are not always faster then the `Object.keys()` method.

For example, removing a property from a test object using a `delete object.propertyName` makes the `for-in` methods slower. It forces V8 to choose a dictionary (Hash Map) for the object's properties representation. This results in slower lookups. At least when compared to the standard V8 optimizations like `HiddenClass` and in-object properties.

If you'd like to learn more about how JavaScript Objects are implemented have a look at [V8 blog's post](https://v8.dev/blog/fast-properties). I also recommend a great post on the [for-in optimizations](https://v8.dev/blog/fast-for-in).
