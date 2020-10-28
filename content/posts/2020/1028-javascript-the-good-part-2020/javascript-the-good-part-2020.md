---
title: "JavaScript: the Good Parts in 2020"
date: "2020-10-28T06:46:37.121Z"
template: "post"
draft: false
slug: "/2020/javascript-the-good-parts"
category: "Blog"
tags:
  - "javascript"
  - "function"
  - "const"
  - "array"
description: "This is a personal list of the stuff that I like about JavaScript and that I believe should be used today."
image: "javascript.png"
---

"JavaScript: the good parts" is a book by Douglas Crockford that made it big in 2008 
as the world began to realize that web development and,  particularly, frontend 
development were here to stay. 

In the book, Douglas focuses on aspects of the language that we can use 
**to write clean code that runs fast**: JavaScript for the Enterprise.

This is my reviewed version of it, adjourned to 2020, because a whole lot of things 
have changed in the last 12 years.

> Less is More  
> -- Ludwig Mies van der Rohe

## In This Article:

- [Contants](#constants)
- [Strict Equality](#strict-equality)
- [Template Literals](#template-literals)
- [Arrow Functions](#arrow-functions)
- [Destructuring Assignment](#destructuring-assignment)
- [Array API](#array-api)
- [Rest Operator](#rest-operator)
- [Spread Operator](#spread-operator)
- [Promises](#promises)
- [Async / Await](#async--await)
- [Try / Catch](#try--catch)
- [Custom Errors](#custom-errors)

## Constants

[Constants][constants] are [_block scoped_][block-scoped] variable who's **reference can not be mutated**. 
If you try to change their value, you will get an exception.

```js
const name = 'Marco';

try {
  name = 'Luca';
}
catch (err) {
  console.log('You can NOT mutate a constant!');
  console.log(err);
}
```

Constants let the [JavaScript engine][v8] to run critical optimization while building the 
assembly out of your source code.

[Click here to read a good article about constants.](https://medium.com/dailyjs/use-const-and-make-your-javascript-code-better-aac4f3786ca1)

👉 It's easy to use default values for constants:

```js
// ❌ bad way, using variables:
let foo = doSomething();
if (!foo) {
  foo = 'default value';
}

// ✅ good way, using constants:
const foo = doSomething() || 'default value';
```

👉 You get even more control with [Ternary Operator][ternary-operator]:

```js
const result = doSomething();
const foo = (result === null)
  ? 'default value'
  : result
```

## Strict Equality

[Strict Equality][strict-equality] ensure faster comparison by enforcing type check.

```js
// ❌ bad way, using loose equality:
//    those examples will yield "true" even if it's 
//    quite obvious that it is not what we expect:lear that 
console.log(1 == "1");
console.log(1 == true);
console.log(0 == false);
console.log(0 == "");
console.log(null == undefined);

// ✅ good way, using strict equality:
//    the same comparison will now yield a correct "false" result:
console.log(1 === "1");
console.log(1 === true);
console.log(0 === false);
console.log(0 === "");
console.log(null === undefined);
```

## Template Literals

```js
const name = 'Marco';
const surname = 'Pegoraro';

console.log(`hello ${name} ${surname}`);
```

[MDN: Template Literals][literals]

## Arrow Functions

```js
const fn = () => {};
```

[Arrow Functions][arrowfn] are a relatively newly introduced syntax to create functions.
It's natively supported in NodeJS since version 4.4.5 and by all major browsers excluding IE.

**With this syntax you can build just a function.** 

There is no `this` so you can't fall into the temptation of creating constructors.
And there is no runtime scope, so you can't mess with it using `call`, `apply` or `bind`.

👉 A function that takes just one argument can skip the `()` around it:

```js
const sayHi = name => {
  console.log(`hi, ${name}`)
};
sayHi('Marco');
```

👉 A function that does just one thing, can omit `{}` and has an implicit `return statement`

```js
const sum = (a, b) => a + b;
console.log(sum(2, 4))
```

👉 An argument can define a default value:

```js
const calculateAge = (dateOfBirth, today = new Date()) => {
  const diff_ms = today.getTime() - dateOfBirth.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

console.log(`You are ${calculateAge(new Date("1981-06-30"))} years old`);
console.log(`You were ${calculateAge(new Date("1981-06-30"), new Date("2010"))} years old in 2010`);
```

👉 It's very easy to tap into [Function Composition][function-composition] 
and [Single Responsibility Principle][srp]:

```js
const ensureDate = (value) => (value instanceof Date ? value : new Date(value));
const dateDiff = (d1, d2) => ensureDate(d1).getTime() - ensureDate(d2).getTime();
const dateYears = (date) => Math.abs(date.getUTCFullYear() - 1970);
const calculateAge = (dateOfBirth, today = new Date()) => dateYears(new Date(dateDiff(today, dateOfBirth)));

console.log(`You are ${calculateAge(new Date("1981-06-30"))} years old`);
console.log(`You were ${calculateAge(new Date("1981-06-30"), new Date("2010"))} years old in 2010`);
```

👉 And it's also easy to [curry][curry] and [thunk][thunk]:

```js
// Generic thunk to sum numbers:
const add = a => b => a + b;

// Specialized function that increase a number:
const inc = add(1);

console.log(inc(1));
console.log(inc(10));
```

👉 It's definitely easy to **avoid switch operators** using 
[Function Composition][function-composition] and [Early Returns][early-returns]:

```js
// ❌ bad way, using conditionals:
let foo = null;
let res = doSomething();

if (res === 'a') {
  foo = 'option 1';
} else if (res === 'b') {
  foo = 'option 2';
} else {
  foo = 'no choice';
}

// ❌ bad way, using switch:
let foo = null;
swith (doSomething()) {
  case 'a':
    foo = 'option 1';
    break;
  case 'b':
    foo = 'option 2';
    break;
  default:
    foo = 'no choice';
}

// ✅ good way, using Function Composition & Return First:
const getChoice = (res) => {
  if (res === "a") return "option 1";
  if (res === "b") return "option 2";
  return "no choiche";
};

const foo = getChoice(doSomething()) || 'default value';
```

## Destructuring Assignment

The [Destructuring Assignment][destructuring] allows to export symbols into the current block:

```js
const payload = {
  name: 'Marco',
  surname: 'Pegoraro',
  dateOfBirth: '1981-06-30'
}

const { name, surname } = payload;

console.log(`name: ${name}`);
console.log(`surname: ${surname}`);
```

👉 It is particularly useful when importing only parts of a module:

```js
// With classic NodeJS style:
const { useMemo, useEffect } = require('react');

// With ES6 modules:
import { useMemo, useEffect } from 'react';
```

👉 And you can use it to implement the [Open-Closed Principle][open-closed]:

```js
// ❌ bad way, using positional arguments with default values:
const doSomething = (a = 1, b = 2, c = 3) => a + b + c;
console.log(doSomething());
console.log(doSomething(5, 5, 5));

// ✅ good way, using destructuring assignment and defaults:
const doSomething = ({ a = 1, b = 2, c = 3 } = {}) => a + b + c;
console.log(doSomething());
console.log(doSomething({ a: 5, b: 5, c: 5 }));
```

The first implementation uses **positional arguments** so if you need to add a new
argument to enrich the function's capabilty you have 2 choices:

1. just append the new argument at the end of the list
2. refactor all the code that uses this function

There are also some other disadvantages of using positional arguments such 
**you can not skip middle arguments**.

The second implementation uses the **destructuring assignment** in order to create
a map of `key:value` that makes it possible:

1. the caller can provide arguments in any order
2. the caller can specify only part of the arguments, the rest will be defaulted
3. adding a new argument (with a default value) won't break existing code

[Click here to read a good article about "named arguments vs positional arguments"](https://blog.bitsrc.io/javascript-why-named-arguments-are-better-than-positional-arguments-9b15ab3155ef)

👉 You can rename properties while destructuring:

```js
const payload = {
  first: "Marco",
  last: "Pegoraro"
};

const { first: name, last: surname } = payload;

console.log(`${name} ${surname}`);
```

👉 You can also nest destructuring assignments:

```js
const payload = {
  name: {
    first: "Marco",
    last: "Pegoraro"
  },
  address: {
    city: "Malmö",
    country: "Sweden"
  }
};

const {
  name: { first: name },
  address: { city }
} = payload;

console.log(`${name} lives in ${city}`);
```

👉 Destructuring Assignment **works with arrays as well**:

```js
const payload = ['one', 'two', 'three'];

// Destructure the first two items:
const [ first, second ] = payload;

console.log(`first: ${first}`);
console.log(`second: ${second}`);
```

## Array API

Lists are ubiquitous nowadays and the good ol' `for ... do` is gone. Instead, you should
consider using the [Array API][array-api] that, in composition with the **arrow functions**
make your code more expressive and readable.

> Javascript engines like [V8][v8] are also able to seriously optimize the 
> exeution of chained Array API.

```js
const jsStuff = [{
  operator: 'switch',
  isAnyGood: false
}, {
  operator: 'var',
  isAnyGood: false
}, {
  operator: 'for',
  isAnyGood: false
}, {
  operator: 'const',
  isAnyGood: true
}, {
  operator: '...',
  isAnyGood: true
}];

// ❌ bad way, using variables and FOR Loops:
let theGoodPart = [];
for (let item of jsStuff) {
  if (true === item.isAnyGood) {
    theGoodPart.push(item);
  }
}

// ✅ good way, using Array API and Function Composition:
const isGood = (item) => (true === item.isAnyGood);
const operatorOnly = (item) => item.operator;
const theGoodPart = jsStuff
  .filter(isGood)
  .map(operatorOnly);
```

## Rest Operator

The [rest operator][rest-operator] is a sweet tool collect "whatever else" from a Javascript
object.

👉 Use it in combination with the Destructuring Assignment:

```js
const payload = {
  name: 'Marco',
  surname: 'Pegoraro',
  dateOfBirth: '1981-06-30',
  hobbies: ['paragliding', 'sailing']
};

// Extract information and collect the remaining keys into "other"
const { name, surname, ...other } = payload;

console.log(other);
```

👉 Use it to collect a function's arguments into an array:

```js
const foo = (a, b, ...args) => {
  console.log(`a: ${a}`);
  console.log(`b: ${b}`);

  // Log all the other arguments:
  args.forEach((arg, idx) => console.log(`${idx}: ${arg}`));
}

foo('a', 'b', 'c', 'd', 'e');
```

## Spread Operator

The [Spread Operator][spread-operator] lets you quikly build [shallow copies][shallow-copy] 
of objects:

```js
const payload = {
  name: 'Marco',
  surname: 'Pegoraro',
  dateOfBirth: '1781-06-30',
  hobbies: ['paragliding', 'sailing']
};

const shallowCopy = {
  ...payload,
  dateOfBirth: '1981-06-30', // I'm not THAT old!
  married: true
}
```

👉 You can nest spread operator to achieve a _manual deep copy_:

```js
const payload = {
  info: {
    first: "Marco",
    last: "Pegoraro"
    address: {
      city: "Malmö",
      country: "Sweden"
    }
  },
  hobbies: ['paragliding', 'sailing']
};

// This is not going to look good for deeply nested objects...
// https://www.npmjs.com/package/clone-deep
const shallowCopy = {
  ...payload,
  info: { 
    ...payload.info,
    address: { ...payload.info.address }
  },
  hobbies: [ ...payload.hobbies ],
}
```

## Promises

[[ TO BE COMPLETED ]]

## Async / Await

[[ TO BE COMPLETED ]]

## Try / Catch

[[ TO BE COMPLETED ]]

## Custom Errors

[[ TO BE COMPLETED ]]


[block-scoped]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block "MDN: Block Scoped"
[constants]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const "MDN: Constants"
[literals]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals "MDN: Template Literals"
[arrowfn]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions "MDN: Arrow Functions"
[function-composition]: https://en.wikipedia.org/wiki/Function_composition_(computer_science) "Function Composition on Wikipedia"
[early-returns]: https://medium.com/better-programming/are-early-returns-any-good-eed4b4d03866 "Pros and cons of Early Returns" 
[curry]: https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983 "Curry"
[thunk]: https://en.wikipedia.org/wiki/Thunk "Thunk in Javascript"
[v8]: https://v8.dev/ "V8: JavaScript Engine"
[ternary-operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator "MDN: Ternary Operator"
[srp]: https://en.wikipedia.org/wiki/Single-responsibility_principle "Single Responsibility Principle on Wikipedia"
[open-closed]: https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle "Open-Closed Principle on Wikipedia"
[destructuring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment "MDN: Destructuring Assignment"
[array-api]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "MDN: Array API"
[rest-operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters "MDN: Rest Operator"
[spread-operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax "MDN: Spread Operator"
[shallow-copy]: https://medium.com/@serdarkabaoglu/shallow-copying-cloning-objects-in-javascript-ee8e0f1c1058 "Shallow copy article on Medium"
[strict-equality]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality "MDN: Strict Equality"