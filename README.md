# rj-validate
Universal JS Validation Library

Install with ```npm i rj-validate```

https://www.npmjs.com/package/rj-validate


Examples:

```javascript
var rj = require("rj-validate");

rj.test('abc123', {
    required: true,
});

// output:
// Object {message: "all tests pass", valid: true}


rj.test('', {
    required: true,
});

// output:
// Object {message: "The input cannot be blank", valid: false}


rj.test('', {
    required: true,
}, 'first name');

// output:
// Object {message: "first name cannot be blank", valid: false}


rj.test('', {
    required: true,
    required_msg: "That's a failure",
});

// output:
// Object {message: "That's a failure", valid: false}
```