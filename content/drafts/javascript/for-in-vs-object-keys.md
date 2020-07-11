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
