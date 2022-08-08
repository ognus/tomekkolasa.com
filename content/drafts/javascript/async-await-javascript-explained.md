---
title: Async await in JavaScript explained
---

## Asynchronous code in JavaScript without async await

### Callbacks

Callback Hell, also known as Pyramid of Doom.

<!-- callback hell example -->

The nesting of callbacks can be mitigated by creating smaller single-purpose functions. If you make sure that a function has no more than a single lebel of callback nesting than the code readability is improved. However it can still be tedious to work with this limitation.

<!-- callback hell mitigated example -->


### Promises

Solves pyramid of doom by making it a chain of doom :D

<!-- Example of error handling using callbacks vs Promises -->

## Async await basics

### Genererators

Async / await as syntax sugar for generators and promises.

<!-- Example of previous code using generators -->

### Async

### Await

<!-- Example of previous generators code using async / await -->

## Error handling with async / await

## Using async / await with a loop
- for loop
- Promise.all

## Async Constructor
How to make asyncrounous calls in object constructor

### Schedule async call in contructor, await in methods


### Static async factory function


## Common pitfalls
- explicitly creating a Promise `return Promise.resolve()`;
- return await not needed, but needed with try/catch:
- try / catch with missing await
- performance hit due to sequentional promise resulution
