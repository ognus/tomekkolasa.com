---
title: How to remove duplicates from array in JavaScript
description: 
date: 2021-02-05 11:00
---

Ever wondered what's the best way to remove duplicates from an array in JavaScript? Got you covered here 😉 Together we'll go through few different ways that JavaScipt developers will likely use.

Before we start, let's make sure our problem is clearly definied. Our objective is turn an array with duplicate elements like this one

```javascript
["🍔", "🍕", "🍔", "🍉", "🍕", "🍇", "🍕", "🍕", "🍎", "🍔"];
```

into an array where each of the elements in present only once:

```javascript
["🍔", "🍕", "🍉", "🍇", "🍎"];
```

In other words, we don't want any element to repeat in the array. Which is perfect in this case, as too many slices of pizza and hamburgers is not good for you 😉.

We'll also look at case when values in the array are more complex objects and we'd like to compare objects by what's inside of them a not by their reference value. 

strict comparison might not always be what we want

Imagine we have a list of food objects instead of emoji string values like before.

```javascript
const foods = [
  { icon: "🍕", name: "pizza", variant: "Pepperoni", ... },
  { icon: "🍕", name: "pizza", variant: "Margherita", ... },
  { icon: "🍔", name: "burger", variant: "Cheeseburger", ... },
  { icon: "🍔", name: "burger", variant: "Wagyu Beef Burger", ... },
]
```

```javascript
const foods.map(({ icon, name }) => ({ icon, name }));
[
  { icon: "🍕", name: "pizza" },
  { icon: "🍕", name: "pizza" },
  { icon: "🍔", name: "burger" },
  { icon: "🍔", name: "burger" },
]

```


Without further ado let's have a look at the first we can accomplish array deduplication in JavaScript.

## Set

This one is my favourite! So no surprises it's on the top 😁.

```javascript
const values = [1, 3, 2, 2, 1];
[...new Set(values)]; // or Array.from(new Set(values));
```

Using `Set` to remove duplicates from an array is great! It's short, understandable, and there is no need to inlude any libraries. I usually wouldn't even wrap it with a named function. `[...new Set(values)]` is clear as it is. I think we all love to use solutions that are concise and feel idiomatic to the language.

It might not be the fastest...

Time Complexity: O(N) - populating a Set with an array values takes N, as check/insert to Set takes O(1). Converting Set to array, i.e. iterating over the Set values also takes O(N).

How to use it to remove duplicated when the values are objects? You can't 

let filteredList = [...new Set(fullNameList.map(JSON.stringify))].map(JSON.parse);


## Lodash

This one is also nice and easy, if you use Lodash or underscore.js:

```javascript
_.uniq(values);
```

I like it because it's really short and the name of the function makes it really clear what it does. However, I don't use it that often anymore since the `Set` was added to JavaScipt. And not all projects use Lodash.

`_.uniqBy`
`_.uniqWith` for objects

## Filter

This one uses JS array filter method to exclude values that repeat. The `filter` method will iterate over an array and for each element we find an index of that element in the array. If it's the same as the current index we know that this element did not have any duplicates so far.

```javascript
function deduplicate(values) {
  return values.filter((value, index) => values.indexOf(value) === index);
}
```

In this case I think it's useful to wrap it the filter call in to new function as it's not that simple of a call anymore to repeat each time we want to use it (DRY). The named funtion `deduplicate` also makes the purpose of the filtering immediatelly clear.

For objects we can `findIndex()` to deduplicate by `id` etc.

## reduce to array with includes


```javascript
function deduplicate(values) {
  return values.reduce((unique, value) => {
    if (!unique.includes(value)) {
      unique.push(value);
    }
    return unique;
  }, []);
}
```

```javascript
function deduplicate(values) {
  return values.reduce(
    (unique, value) => (unique.includes(value) ? unique : [...unique, value]),
    []
  );
}
```

For objects we can use `Array.some()` as it accept the condition to check:

```javascript
function deduplicate(objects, key) {
  return objects.reduce(
    (unique, object) => (
      unique.some(obj => obj[key] === object[key]) ? unique : [...unique, object]
    ),
    []
  );
}
```

## Using the for loop

This is the most straighforward. If you'd have much experience in JavaScript and someone asked you to write a function that removes the duplicates from an array, that would probably be it. Nothing really bad about it, as this implementation is very easy to read and understand. Classical imperative programming style :) This implementation would most likely look very similar in other languages, like Java, C++ or Go (TODO: check).

I'll use the `for of` loop here, but the classic C-style `for` loop or the `.forEach()` array method would work equally well.

```javascript
function deduplicate(values) {
  const unique = [];

  for (value of values) {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  }

  return unique;
}
```

We create a new empty array called `unique`, which will contain all the unique values. Then we iterate over the array of values and for each value we check if the `unique` array already contains it or not. If it doesn't, we add the value to the `unique` array.

O(N2) complexity as for each element on an input array O(N) we need to iterate over the `unique` array (another O(N)). As you might have noticed we can improve that by using `Set` instead of an array to accumulate unique values.

```javascript
function deduplicate(values) {
  const unique = new Set();

  for (value of values) {
    if (!unique.has(value)) {
      unique.add(value);
    }
  }

  return Array.from(unique);
}
```

We don't really need the `unique.has(value)` call, as Set will never store duplicate values, even if we `add()` the same element multiple times.

```javascript
function deduplicate(values) {
  const unique = new Set();

  for (value of values) {
    unique.add(value);
  }

  return Array.from(unique);
}
```

And since we can just pass an array to the `new Set()` contructor we arrive to basically the same implementation as our first example:

```javascript
function deduplicate(values) {
  const unique = new Set(values);
  return Array.from(unique); // or return [...unique];
}
```


## reduce to Object

This is a technique that's conceptually very similar to the first example that was using `Set`. In fact, before Set was introduced in JavaScript using objects as a map/dictionary was the most straighoaway way to implement a collection of unique values.

We use `.reduce()` to reduce (lol) the array to an object where each values from the array will be the property name (the key). Because objects in JavaScript (same as dictionaries, hash maps and assiciative arrays) can only have one property with a particular name, setting it multiple times overwrites the value. We don't really care about the value here, but the fact that all the property names in the object represent an unique collection of out initial values.

At the end we can convert the object to an array of it's property names by using `Object.values()`.


I often use this technique instead when I want to deduplicate  with arrays


https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#objects_vs._maps


```javascript
function dedupe5(values) {
  return Object.values(
    values.reduce((acc, value) => ({ ...acc, [value]: value }), {})
  );
}

function dedupe6(values) {
  const unique = {};

  for (value of values) {
    unique[value] = value;
  }

  return Object.values(unique);
}

function dedupe7(values) {
  const unique = new Map();

  for (value of values) {
    unique.set(value, value);
  }

  return Array.from(unique.values());
}

function dedupe8(values) {
  return Array.from(new Set(values));
}

function dedupe9(values) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

const values = [1, 3, 3, 2, 1, 1, 2];

console.log(dedupe1(values));
console.log(dedupe2(values));
console.log(dedupe3(values));
console.log(dedupe4(values));
console.log(dedupe5(values));
console.log(dedupe6(values));
console.log(dedupe7(values));
console.log(dedupe8(values));
console.log(dedupe9(values));
```


## Performance comparison