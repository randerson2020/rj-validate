const assert = require('chai').assert;
const rj = require('../dist/main.js');

// Testing the 'required' rule extensively here to prove the integration. Other rules will be tested at the unit level

describe('validate() parameter checking', () => {
	it('should throw an error if no arguments included', () => {
		assert.throw(
			rj.validate, 
			Error, 
			"Not enough arguments passed to function 'validate'"
		);
	});

	it('should throw an error if only 1 argument included', () => {
		assert.throw(
			() => {rj.validate('test')}, 
			Error, 
			"Not enough arguments passed to function 'validate'"
		);
	});

	it('should throw an error if the rules argument is not an object', () => {
		assert.throw(
			() => {rj.validate('test', 'test')}, 
			Error, 
			"Rules must be an object"
		);
	});

	it('should throw an error if the value to test is an object', () => {
		assert.throw(
			() => {rj.validate({}, {})}, 
			Error, 
			"Invalid test parameter"
		);
	});

	it('should throw an error if the value to test is a date object', () => {
		assert.throw(
			() => {rj.validate(new Date('2018-01-02'), {})}, 
			Error, 
			"Invalid test parameter"
		);
	});

	it('should throw an error if the value to test is an array', () => {
		assert.throw(
			() => {rj.validate([], {})}, 
			Error, 
			"Invalid test parameter"
		);
	});

	it('should throw an error if the value to test is a function', () => {
		assert.throw(
			() => {rj.validate(function(){}, {})}, 
			Error, 
			"Invalid test parameter"
		);
	});
});

describe('validate() valid flag', () => {
	// -----------------
	// - required rule -
	// -----------------

	it('should return valid === true if required is set to false', () => {
		var output = rj.validate(undefined, {required: false});
		assert.equal(output.valid, true);
	});

	it('should return valid === false for required on undefined', () => {
		var output = rj.validate(undefined, {required: true});
		assert.equal(output.valid, false);
	});

	it('should return valid === false for required on undefined object property', () => {
		var output = rj.validate({}.foo, {required: true});
		assert.equal(output.valid, false);
	});

	it('should return valid === false for required on null', () => {
		var output = rj.validate(null, {required: true});
		assert.equal(output.valid, false);
	});

	it('should return valid === false for required on 0', () => {
		var output = rj.validate(0, {required: true});
		assert.equal(output.valid, false);
	});

	it('should return valid === true for required on 1', () => {
		var output = rj.validate(1, {required: true});
		assert.equal(output.valid, true);
	});

	it('should return valid === false for required on an empty string', () => {
		var output = rj.validate('', {required: true});
		assert.equal(output.valid, false);
	});

	it('should return valid === false for required on an empty string with a custom variable name', () => {
		var output = rj.validate('', {required: true}, 'first_name');
		assert.equal(output.valid, false);
	});

	it('should return valid === true for required on a non-empty string', () => {
		var output = rj.validate('abc123', {required: true});
		assert.equal(output.valid, true);
	});

	// -------------
	// - same rule -
	// -------------

	it('should return valid === true if same is set to false', () => {
		var output = rj.validate(undefined, {same: false});
		assert.equal(output.valid, true);
	});

	it('should return valid === true if same.value is the same string as the value to test', () => {
		var same_rule = {
			name: 'test_var',
			value: 'abc123',
		};

		var output = rj.validate('abc123', {same: same_rule});
		assert.equal(output.valid, true);
	});

	it('should return valid === true if same.value is the same float as the value to test', () => {
		var same_rule = {
			name: 'test_var',
			value: 12.34,
		};

		var output = rj.validate(12.34, {same: same_rule});
		assert.equal(output.valid, true);
	});

	it('should return valid === false if same.value is a different float as the value to test', () => {
		var same_rule = {
			name: 'test_var',
			value: 12.34,
		};

		var output = rj.validate(12.34001, {same: same_rule});
		assert.equal(output.valid, false);
	});

	// ------------
	// - min rule -
	// ------------

	it('should return valid === true for required and a min of 2 on "foobar"', () => {
		var output = rj.validate('foobar', {
			required: true,
			min: 2,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for required and a min of 7 on "foobar"', () => {
		var output = rj.validate('foobar', {
			required: true,
			min: 7,
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === false for required,  min of 2, and max of 5 on "foobar"', () => {
		var output = rj.validate('foobar', {
			required: true,
			min: 2,
			max: 5,
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === false for required,  min of 2, and alpha on "foo7bar"', () => {
		var output = rj.validate('foo7bar', {
			required: true,
			min: 2,
			alpha: true,
		});
		
		assert.equal(output.valid, false);
	});

	// ---------------
	// - po_box rule -
	// ---------------

	it('should return valid === true for min of 2 and po_box false on "foo7bar"', () => {
		var output = rj.validate('foo7bar', {
			min: 2,
			po_box: false,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === true for min of 2 and not_po_box false on "foo7bar"', () => {
		var output = rj.validate('foo7bar', {
			min: 2,
			not_po_box: false,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for min of 2 and po_box on "foo7bar"', () => {
		var output = rj.validate('foo7bar', {
			min: 2,
			po_box: true,
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === true for min of 2 and not_po_box on "foo7bar"', () => {
		var output = rj.validate('foo7bar', {
			min: 2,
			not_po_box: true,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === true for min of 2 and po_box on "po box 123"', () => {
		var output = rj.validate('po box 123', {
			min: 2,
			po_box: true,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for min of 2 and not_po_box on "po box 123"', () => {
		var output = rj.validate('po box 123', {
			min: 2,
			not_po_box: true,
		});
		
		assert.equal(output.valid, false);
	});

	// -----------
	// - numeric -
	// -----------

	it('should return valid === true for min of 2 and numeric false on "foo7bar"', () => {
		var output = rj.validate('foo7bar', {
			min: 2,
			numeric: false,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for min of 2 and numeric true on "foo7bar"', () => {
		var output = rj.validate('foo7bar', {
			min: 2,
			numeric: true,
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === true for min of 2 and numeric false on "123"', () => {
		var output = rj.validate('123', {
			min: 2,
			numeric: false,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === true for min of 2 and numeric of "string" on "123"', () => {
		var output = rj.validate('123', {
			min: 2,
			numeric: "string",
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for min of 2 and numeric of "number" on "123"', () => {
		var output = rj.validate('123', {
			min: 2,
			numeric: "number",
		});
		
		assert.equal(output.valid, false);
	});

	// ---------------
	// - number rule -
	// ---------------

	it('should return valid === true for min of 2 and number of false on "abc"', () => {
		var output = rj.validate('abc', {
			min: 2,
			number: false,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for min of 2 and number of true on "abc"', () => {
		var output = rj.validate('abc', {
			min: 2,
			number: true,
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === true for min of 2 and number of true on 123', () => {
		var output = rj.validate(123, {
			min: 2,
			number: true,
		});
		
		assert.equal(output.valid, true);
	});

	// ---------------
	// - string rule -
	// ---------------

	it('should return valid === true for min of 2 and string of false on 123', () => {
		var output = rj.validate(123, {
			min: 2,
			string: false,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for min of 2 and string of true on 123', () => {
		var output = rj.validate(123, {
			min: 2,
			string: true,
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === true for min of 2 and string of true on "abc"', () => {
		var output = rj.validate('abc', {
			min: 2,
			string: true,
		});
		
		assert.equal(output.valid, true);
	});

	// --------------
	// - email rule -
	// --------------

	it('should return valid === true for min of 2 and email:false on "abc"', () => {
		var output = rj.validate('abc', {
			min: 2,
			email: false,
		});
		
		assert.equal(output.valid, true);
	});

	it('should return valid === false for min of 2 and email on "abc"', () => {
		var output = rj.validate('abc', {
			min: 2,
			email: true,
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === true for min of 2 and email on "abc@abc.abc"', () => {
		var output = rj.validate('abc@abc.abc', {
			min: 2,
			email: true,
		});
		
		assert.equal(output.valid, true);
	});

	// -------------
	// - date rule -
	// -------------

	it('should return valid === false for required and date on "abc"', () => {
		var output = rj.validate('abc', {
			required: true,
			date: 'yyyy-mm-dd',
		});
		
		assert.equal(output.valid, false);
	});

	it('should return valid === true for required and date:yyyy-mm-dd on "1987-10-01"', () => {
		var output = rj.validate('1987-10-01', {
			required: true,
			date: 'yyyy-mm-dd',
		});
		
		assert.equal(output.valid, true);
	});

	// -----------------
	// - datetime rule -
	// -----------------

	it('should return valid === true for required and datetime:yyyy-mm-dd hh:mm:ss on "1987-10-01 12:31:01"', () => {
		var output = rj.validate('1987-10-01 12:31:01', {
			required: true,
			datetime: 'yyyy-mm-dd hh:mm:ss',
		});
		
		assert.equal(output.valid, true);
	});
});

describe('validate() output message', () => {
	// -----------------
	// - required rule -
	// -----------------

	it('should return the correct failure message for required on an empty string', () => {
		var expected_msg = 'The input cannot be blank';
		var actual_msg = rj.validate('', {required: true}).message;
		assert.equal(actual_msg, expected_msg);
	});

	it('should return the correct failure message for required on an empty string with a custom variable name', () => {
		var expected_msg = 'first_name cannot be blank';
		var actual_msg = rj.validate('', {required: true}, 'first_name').message;
		assert.equal(actual_msg, expected_msg);
	});

	it('should return the correct custom failure message for required on an empty string', () => {
		var expected_msg = 'This is a pretty weird validation message';
		
		var actual_msg = rj.validate('', {
			required: true,
			required_msg: 'This is a pretty weird validation message',
		}).message;
		
		assert.equal(actual_msg, expected_msg);
	});

	it('should return the correct custom failure message for required on an empty string with a custom variable name', () => {
		var expected_msg = 'This is a pretty weird validation message again';
		
		var output = rj.validate('', {
			required: true,
			required_msg: 'This is a pretty weird validation message again',
		}, 'first_name');

		var actual_msg = output.message;
		
		assert.equal(actual_msg, expected_msg);
	});

	it('should return the correct success message for required on a non-empty string', () => {
		var expected_msg = 'all tests pass';
		var actual_msg = rj.validate('abc123', {required: true}).message;
		assert.equal(actual_msg, expected_msg);
	});

	// -------------
	// - same rule -
	// -------------

	it('should return the correct error message for same rule on different values', () => {
		var same_rule = {
			name: 'test_var',
			value: 'abc123',
		};

		var expected_msg = 'The input must be the same as test_var';
		var actual_msg = rj.validate('foobar', {same: same_rule}).message;
		assert.equal(expected_msg, actual_msg);
	});

	it('should return the correct error message for same rule on different values, with a custom variable name', () => {
		var same_rule = {
			name: 'second_var',
			value: 'abc123',
		};

		var expected_msg = 'first_var must be the same as second_var';
		
		var actual_msg = rj.validate(
			'foobar', 
			{same: same_rule},
			'first_var'
		).message;
		
		assert.equal(expected_msg, actual_msg);
	});

	// ------------
	// - min rule -
	// ------------

	it('should return the correct error message for required and a min of 7 on "foobar"', () => {
		var output = rj.validate('foobar', {
			required: true,
			min: 7,
		});

		var expected_msg = 'The input must be 7 or longer';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct error message for required and a min of 7 on "foobar" with the variable name passed in', () => {
		var output = rj.validate('foobar', {
			required: true,
			min: 7,
		}, 'Profile name');

		var expected_msg = 'Profile name must be 7 or longer';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct error message for required and a min of 7 on "foobar" with a custom error message', () => {
		var output = rj.validate('foobar', {
			required: true,
			required_msg: 'Profile name is definitely required, yo',
			min: 7,
			min_msg: "Hold on, that profile name isn't long enough",
		});

		var expected_msg = "Hold on, that profile name isn't long enough";
		
		assert.equal(output.message, expected_msg);
	});

	// ------------
	// - max rule -
	// ------------

	it('should return the correct error message for required, a min of 2 and a max of 5 on "foobar"', () => {
		var output = rj.validate('foobar', {
			required: true,
			min: 2,
			max: 5,
		});

		var expected_msg = 'The input must be 5 or shorter';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct error message for required, a min of 7 and a max of 30 on "foobar"', () => {
		var output = rj.validate('foobar', {
			required: true,
			min: 7,
			max: 30,
		});

		var expected_msg = 'The input must be 7 or longer';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct error message for required, a min of 2 and a max of 5 on 6', () => {
		var output = rj.validate(6, {
			required: true,
			min: 2,
			max: 5,
		});

		var expected_msg = 'The input must be 5 or smaller';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct error message for required, a min of 7 and a max of 30 on 6', () => {
		var output = rj.validate(6, {
			required: true,
			min: 7,
			max: 30,
		});

		var expected_msg = 'The input must be 7 or larger';
		
		assert.equal(output.message, expected_msg);
	});

	// --------------
	// - alpha rule -
	// --------------

	it('should return the correct error message for required, a min of 5 and alpha on "foo7bar"', () => {
		var output = rj.validate("foo7bar", {
			required: true,
			min: 5,
			alpha: true,
		});

		var expected_msg = 'The input may only contain letters';
		
		assert.equal(output.message, expected_msg);
	});

	// ---------------------
	// - alphanumeric rule -
	// ---------------------

	it('should return the correct error message for required and alphanumeric on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			alphanumeric: true,
		});

		var expected_msg = 'The input may only contain letters or numbers';
		
		assert.equal(output.message, expected_msg);
	});

	// ---------------
	// - po_box rule -
	// ---------------

	it('should return the correct error message for required and po_box true on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			po_box: true,
		});

		var expected_msg = 'The input must be a P.O. Box';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct error message for required and not_po_box true on "po box 123" with custom variable name', () => {
		var output = rj.validate("po box 123", {
			required: true,
			not_po_box: true,
		}, 'street line 1');

		var expected_msg = 'street line 1 must not be a P.O. Box';
		
		assert.equal(output.message, expected_msg);
	});

	// ----------------
	// - numeric rule -
	// ----------------

	it('should return the correct error message for required and numeric true on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			numeric: true,
		});

		var expected_msg = 'The input must be a number';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct error message for required and numeric string on 123 with a custom variable name', () => {
		var output = rj.validate(123, {
			required: true,
			numeric: 'string',
		}, 'birth date');

		var expected_msg = 'birth date must be a number';
		
		assert.equal(output.message, expected_msg);
	});

	// ---------------
	// - number rule -
	// ---------------

	it('should return the correct error message for required and number true on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			number: true,
		});

		var expected_msg = 'The input must be a number';
		
		assert.equal(output.message, expected_msg);
	});

	// ---------------
	// - string rule -
	// ---------------

	it('should return the correct error message for required and string true on 123', () => {
		var output = rj.validate(123, {
			required: true,
			string: true,
		});

		var expected_msg = 'The input must be a string';
		
		assert.equal(output.message, expected_msg);
	});

	// --------------
	// - email rule -
	// --------------

	it('should return the correct error message for required and email on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			email: true,
		});

		var expected_msg = 'The input must be an email address';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct custom error message for required and email on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			email: true,
			email_msg: 'not valid email',
		});

		var expected_msg = 'not valid email';
		
		assert.equal(output.message, expected_msg);
	});

	// -------------
	// - date rule -
	// -------------

	it('should return the correct error message for required and date on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			date: 'yyyy-mm-dd',
		});

		var expected_msg = 'The input must be a date';
		
		assert.equal(output.message, expected_msg);
	});

	it('should return the correct custom error message for required and date on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			date: 'yyyy-mm-dd',
			date_msg: 'not valid date',
		});

		var expected_msg = 'not valid date';
		
		assert.equal(output.message, expected_msg);
	});

	// -----------------
	// - datetime rule -
	// -----------------

	it('should return the correct error message for required and datetime on "foo7bar!@#"', () => {
		var output = rj.validate("foo7bar!@#", {
			required: true,
			datetime: 'yyyy-mm-dd',
		});

		var expected_msg = 'The input must be a datetime';
		
		assert.equal(output.message, expected_msg);
	});
});

// Testing test() just to make sure it returns the same responses as validate()
// --
describe('test()', () => {
	it('should throw an error if no arguments included', () => {
		assert.throw(
			rj.test, 
			Error, 
			"Not enough arguments passed to function 'validate'"
		);
	});

	it('should throw an error if the value to test is an array', () => {
		assert.throw(
			() => {rj.test([], {})}, 
			Error, 
			"Invalid test parameter"
		);
	});

	it('should return valid === false for required on an empty string', () => {
		var output = rj.test('', {required: true});
		assert.equal(output.valid, false);
	});

	it('should return valid === false for required on an empty string with a custom variable name', () => {
		var output = rj.test('', {required: true}, 'first_name');
		assert.equal(output.valid, false);
	});

	it('should return the correct failure message for required on an empty string', () => {
		var expected_msg = 'The input cannot be blank';
		var actual_msg = rj.test('', {required: true}).message;
		assert.equal(actual_msg, expected_msg);
	});

	it('should return the correct failure message for required on an empty string with a custom variable name', () => {
		var expected_msg = 'first_name cannot be blank';
		var actual_msg = rj.test('', {required: true}, 'first_name').message;
		assert.equal(actual_msg, expected_msg);
	});

	it('should return valid === true for required on a non-empty string', () => {
		var output = rj.test('abc123', {required: true});
		assert.equal(output.valid, true);
	});

	it('should return the correct success message for required on a non-empty string', () => {
		var expected_msg = 'all tests pass';
		var actual_msg = rj.test('abc123', {required: true}).message;
		assert.equal(actual_msg, expected_msg);
	});
});
