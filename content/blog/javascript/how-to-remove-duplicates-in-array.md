## Lodash

```javascript
_.uniq(array);
```

## Set

```javascript
const values = [1, 3, 2, 2, 1];
Array.from(new Set(values)); // [...new Set(values)];
```

# Filter

```javascript
function deduplicate(values) {
  return values.filter((value, index) => values.indexOf(value) === index);
}
```

## reduce to array with includes

```javascript
const values = [1, 3, 2, 2, 1];
values.reduce(
  (unique, v) => (unique.includes(v) ? unique : [v, ...unique]),
  []
);
```

## reduce to Object

```javascript
function dedupe1(values) {
  return values.reduce(
    (unique, value) => (unique.includes(value) ? unique : [...unique, value]),
    []
  );
}

function dedupe2(values) {
  return values.reduce((unique, value) => {
    if (!unique.includes(value)) {
      unique.push(value);
    }
    return unique;
  }, []);
}

function dedupe3(values) {
  const unique = [];

  values.forEach(value => {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  });

  return unique;
}

function dedupe4(values) {
  const unique = [];

  for (value of values) {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  }

  return unique;
}

function dedupe4(values) {
  const unique = [];

  for (value of values) {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  }

  return unique;
}

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
