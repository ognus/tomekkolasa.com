---
title: How to check if the object is empty in JavaScript
toc: true
toc_label: "Table of Contents"
---

In JavaScript and other programming languages as well, more often then not there are several ways to accomplish even fairly basic coding tasks like checking if array or object is empty. Let's have a look at some of the popular ways to check if the object is empty in JavaScript.

## Using Object.keys() or Object.entries()

```javascript
const isMyObjectEmpty = Object.keys(myObject).length === 0;
```

Using `Object.keys()` is my preferred method of checking if an object is empty. It's acceptably short, and the intentions behind the code are clear, as we grab all the object's properties to see if any are actually there.

We could also `Object.entries()` to achieve the same result:

```javascript
const isMyObjectEmpty = Object.entries(myObject).length === 0;
```

`Object.keys()` returns an array of object's keys (or property names). On the other hand, `Object.entries()` returns an array of `[key, value]` pairs (arrays of length 2). Both of them are super useful to loop through the object properties. In this case, we can just use one of them to check if the array of keys is empty (`.length === 0`). If it is, it means there are no properties in the object, hence we can consider the object to be empty.

In my opinion `Object.keys()` is a bit more clear for this use case and `.keys()` is slightly shorter to write then `.entries()` ;) Furthermore, `Object.keys()` seems to be generally faster then `Object.entries()` ([benchmark results](#Performance comparison
)).

Falsyfying the `.length` instead of comparing to `0` is also a common and usually acceptable practice in JavaScript:

```javascript
const isMyObjectEmpty = !Object.keys(myObject).length;
```

## Using Lodash

```javascript
const isMyObjectEmpty = _.isEmpty(myObject);
```

My second favourite. I used to use it a lot, especially in the Underscore.js days, a similar library that predated Lodash. Recently I tend to prefer not to relly on Lodash that much.

Since modern JavaScript's introduction of great Array and Object methods like `.entries()`, `.map()`, `.reduce()` and recently `.flat()`, working with JavaScript code without any external libraries is quite pleasant. You can also save a few kB on the bundle size when doing frontend JavaScript development by skipping Lodash.

However, I don't have anything against Lodash at all. I still like and use it on some projects. It's still extremely popular and worth trying out if you haven't had a chance.

The great thing about Lodash's `_.isEmpty` in particular is that it works as you'd expect with all other JavaScript primitives and data types as well, not only plain object. For example:

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

Which in plain JavaScript might not be the behaviour you want or would expect:

```javascript
!""; // true
![]; // false, bacause references to objects coerce to true
!{}; // false
!null; // true
!undefined; // true
!Number.NaN; // true
!0; // true
```

## Using hasOwnProperty()

```javascript
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}

const isMyObjectEmpty = isEmpty(myObject);
```

Here we created our own utility function `isEmpty()` which we can use to check if the object is empty.

I think this is also a nice solution, as the `isEmpty` name clearly conveys the intention of the function (we could be more specific and call it `isObjectEmpty()`) and the implementation also clearly conveys our intentions. We loop through all of the object properties (own and inherited) using a `for in` loop and check if there any property actually belongs to the object by using the `.hasOwnProperty()` method.

It's exactly how the part of Lodash's `_.isEmpty` that handles the object check is implemented. Have a look at the [Lodash's source code](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11495-L11500).

## Using JSON.stringify()

```javascript
const isMyObjectEmpty = JSON.stringify(myObject) === "{}";
```

I have seen this method being used quite a bit, but I don't really like it. Converting an object to a string just to check if it's empty feels unnecessary and hackish. If you already have a JSON string that's not yet parsed into an object, for example as a result of API call, and you just need to determine if the object is empty, then maybe it's ok.

`JSON.stringify(myObject) === "{}"` is also the slowest method to check if an object is empty ([benchmark results](#Performance comparison)).

To digress a bit :) There are two other uses of `JSON.stringify()` to be careful with and better avoid altogether:

- **Deep cloning**: it's better to use Lodash's `_.cloneDeep(obj)`, as using `JSON.parse(JSON.stringify(obj))` has some unobvious gotchas like some properties not being copied over, most notably functions, `undefined` value, `Date` object, and `Infinity` value. It works as expected just for plain JavaScript objects. If you really, really want to use it, please be careful :)

- **Deep comparison**: it simply doesn't work unless both object's properties are in the same order. Back in the day I used to use it to compare test results but I had to sort the properites. Silly of me :) It's better to use Node's `assert.deepStrictEqual()` or any modern assertion libraries.

## Other alternatives

### jQuery

```javascript
const isMyObjectEmpty = jQuery.isEmptyObject(myObject);
```

We don't really talk much about jQuery is recent years, but I think it's still a fairly popular library. It's simple to learn and it's included by default in Wordpress. It used to be immensely popular so I'm sure there are still many a bit older sites that you might end up maintaining. So if you happen to have jQuery included, `$.isEmptyObject()` might be a good option.

It's implemented similarly to Lodash and our custom `isEmpty()` function, as it iterates over object properties using a far loop. However, it doesn't call `hasOwnProperty()` to check if a property is defined in the object or anywhere up the prototype chain. You can have a look at it in the [jQuery source code](https://github.com/jquery/jquery/blob/3.x-stable/src/core.js#L239-L246).

Similar to other options (beside Lodash) `$.isEmptyObject()` only works well with plain JavaScript objects. To determine if an object is a plain JavaScript object we can use other jQuery utility `$.isPlainObject()`.

### Not checking if the object is empty

While working on the code, we might not always realize that there is often an equally good solution that won’t require checking if the whole object is empty.

Alternatively, it might be enough to check for a specific property (`const isEmpty = !obj.myProp`), that we know should always exist if the object is defined.

Another use case for establishing if an object is empty is using objects as a dictionary (or map) data structure in JavaScript. We sometimes need to check if the object is empty to know if there are any items in our dictionary. I usually use `Object.keys(myDict).length` for that purpose so I can get the size of my dictionary and check if it’s empty (`=== 0`).

However, using an actual [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) data structure might be a better option, especially if you need to preserve the order of inserted elements. This way we can check if our map is empty by using it’s `size` property:

```javascript
const map = new Map();

const isEmpty = map.size === 0;
```

## Performance comparison

I have prepared simple benchmark at [JSBench benchmark](https://jsbench.me/7xk9xur7cf/1) to compare the execution time of all the above ways of determining if an object is empty or not.

| Method                   | Operations               | Result        |
| ------------------------ | ------------------------ | ------------- |
| `isEmpty()`              | 76,655,475 ops/s ± 0.90% | fastest       |
| `jQuery.isEmptyObject()` | 36,420,344 ops/s ± 2.02% | 52.49% slower |
| `Object.keys()`          | 30,715,859 ops/s ± 0.97% | 59.93% slower |
| `_.isEmpty()`            | 6,820,592 ops/s ± 0.63%  | 91.10% slower |
| `Object.entries()`       | 4,831,865 ops/s ± 0.26%  | 93.70% slower |
| `JSON.stringify()`       | 214,802 ops/s ± 0.31%    | 99.72% slower |

Not that it matters much in most everyday coding, but it's interesting to see how different ways of checking if an object is empty stand against each other in terms of raw speed.

The simple custom implementation of `isEmpty()` is the fastest, but jQuery and `Object.keys()` are not that much slower. Also it's iteresting to see that `Object.keys()` is faster then `Object.entries()`. **That makes a clear winner overral for me.**
