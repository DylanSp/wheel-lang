# WheelLang v0.3

The wheel. I reinvented it.

More seriously, this is a small toy programming language, built to demonstrate and practice techniques for implementing basic imperative and object-oriented languages. Not to be used in production, not to be confused with Python wheels.

## How to Run Wheel Programs

The only external dependencies for building and using this language are `node` and either `npm` or `yarn`. All other dependencies will be installed locally from `package.json`, including TypeScript.

1. Clone the repo.
1. Install dependencies with `yarn install`/`npm install`.
1. Build the interpreter with `yarn build`/`npm run build`.
1. Run a program with `node dist/main.js -f sourceFile1 sourceFile2 ... [-a commandLineArg1 commandLineArg2 ...]`. Source files can be listed in any order, regardless of dependencies. Examples:
    1.  Running a single-file program: `node dist/main.js -f examples/adder/adder.wheel`.
    1. Running a multi-file program: `node dist/main.js -f examples/modules_basic/basic_module.wheel examples/modules_basic/basic_consumer.wheel`.
    1. Running a program with command-line arguments: `node dist/main.js -f examples/cli_arguments/command_line_arguments.wheel -a 0 1 2`.

## Programming in Wheel

### Syntax

Wheel files each contain a single module, with the following structure:
```
module [module name]
{
  [top-level statements here]
}
export [comma-delimited list of exported identifiers];
```

For example, a module that defines two values and exports them would look like:

```
module ExampleValue
{
  let x = 1;
  let y = 2;
}
export x, y;
```

The body of each module is a block of statements, following a roughly JavaScript-esque syntax. There are ten types of statements:

1. Standalone expressions (followed by a semicolon), i.e. `printNum(1);`. Most commonly used for calling functions.
2. Function declarations, following Javascript function declaration syntax. Example:

```
function f(x)
{
  return x;
}
```

3. Return statements (optionally returning a value). Example:

```
return 1;
```

4. Variable declarations, using the keyword `let`. This declares a variable for use in this scope, and may optionally initialize the variable with an expression's value. Example:

```
let x;
let y = 3;
```

5. Variable assignments. The variable must be declared either beforehand or in the same statement. Variables are mutable. Example:

```
let x = 0;
x = x + 1;

let y;
y = 2;
```

6. Setting a field value on an object. Fields are accessed with a `.`, i.e. `obj.fieldName`; JS's `obj["fieldName"]` syntax is not currently supported. Example:

```
let obj = {};
obj.field = 1;
```

7. If statements. Braces around the body are mandatory, as is an `else` block. Example:

```
if (x == 1)
{
  return 2;
}
else
{
  return 0;
}
```

`if {} else if {} else{}` chains (with an arbitrary number of `else if` blocks) are now allowed, as of v0.2.

8. While statements. Braces around the body are mandatory. Example:

```
while (x < 2)
{
  y = y + 5;
  x = x + 1;
}
```

9. Import statements, using the syntax `import exportedIentifier from Module`. These statements can be used in any scope; they're not limited to the top level of a module.

10. Class declarations. These begin with `class ClassName`, followed by a block defining methods and (optionally) a constructor. The constructor is a function declaration without the `function` keyword and the name "`constructor`"; methods are function declarations without the `function` keyword and any name. Example:

```
class Dog
{
  constructor(name)
  {
    this.name = name;
  }

  printName()
  {
    print(this.name);
  }
}
```

Expressions can have number, boolean, object, and `null` values, as well as variable references. Supported operators:

- Arithmetic: `+`, `-`, `*`, `/`
- Logical: `&`, `|`, `!` (Note that logical and/or use a single character, not `&&`/`||`)
- Relational: `<`, `>`, `<=`, `>=`, `==`, `/=` (last operator is the not-equal operator)

Operator precedence is documented in [`docs/precedence.md`](docs/precedence.md).

Reserved keywords:

- `let`
- `function`
- `return`
- `if`
- `else`
- `while`
- `true`
- `false`
- `null`

For a somewhat more formal specification of the grammar, see `docs/grammar.ne`, which goes over the grammar's structure, using the format of [nearley.js](https://nearley.js.org/); it can be explored by pasting it into the [Nearley Parser Playground](https://omrelli.ug/nearley-playground/). This version of the grammar doesn't include any whitespace, though, so the generated examples will be hard to read.

### Semantics

Wheel is dynamically typed, supporting several types of values: numbers, booleans, functions, objects, and `null`. There are no strings and no built-in collection types. A few notes:

- All variables are mutable; there's no `const`.
- Higher-order functions are supported.
- The `==` and `/=` operators only operate on two operands of the same type.
- The `!` operator only operates on booleans.
- `null` can only be compared to objects (currently; follow [issue #58](https://github.com/DylanSp/wheel-lang/issues/58) for possible revision of this)
- Wheel objects are comparable to C structs; they're bags of data, nothing more.
  - Accessing an undeclared field on an object returns null, i.e. `{ return {}.field; }` returns `null`.
  - Fields do not have to be declared on an object's initial declaration/initialization to be set. `{ let obj = {}; obj.a = 1; }` is a legal program.
  - Objects can have functions assigned to fields, but these functions are not true object methods, they don't have a built-in `this` reference to the object. However, "methods" can be constructed with some setup; see [`examples/oop.wheel`](examples/oop.wheel), and v0.3 will explore JS-style prototypical objects and inheritance, see [issue #43](https://github.com/DylanSp/wheel-lang/issues/43).

For input, Wheel has two functions (provided by the interpreter), `readNum()` and `readBool()`. Both of these functions display a prompt character, read a string from user input, then attempt to parse it as a number or boolean. If the input parses correctly, the functions return an object with an `isValid` field set to `true` and a `value` field with the parsed value; if the input does not parse, they return an object with an `isValid` field set to `false`.

- For parsing numbers, the interpreter uses JavaScript's `parseFloat()` function; see its documentation for valid input formats.
- For parsing booleans, the interpreter recognizes `"true"` and `"false"` (with that exact lack of capitalization) as valid inputs; all other strings fail to parse.

For output, Wheel has two functions (provided by the interpreter), `printNum()` and `printBool()`. `printNum()` takes a number value and prints it to the console; `printBool()` takes a boolean value and prints it to the console. The driver in `src/main.ts` also prints the result returned from a program's top-level, if it exists.

Additionally, Wheel has a function `clock()` that returns the number of milliseconds since the start of the Unix epoch. (Yes, it's just a wrapper for JS's `Date.now()`)

## Implementation/Architecture Notes

The Wheel interpreter is built as a composition of three modules: scanning/lexing, parsing, and evaluation. [`full_pipeline`](src/full_pipeline.ts) feeds a string input through the three modules, aborting at the first error. [`main`](src/main.ts) acts as the top-level driver, reading a program file into memory, running the pipeline, and reporting the result/errors.

Each of the modules is built around a single central function, which either reports an error or produces a type to be consumed by the next module. `scan()` and `parse()` are pure functions; `evaluate()` may prompt for input or log output to the console. This design allows for a small API surface, with each function having a single responsibility, no external dependencies, and no side effects. This allows for extensive unit testing; for examples of how each module is used, consult the `test` directory.

In addition to the central functions, each module also exports the types required to consume its output. [`types`](src/types.ts) contains types used by multiple modules.

### Scanning

The scanner is relatively straightforward; it uses regexes and string equality checks to work through the input string, emitting an array of tokens (or invalid characters). These tokens denote various syntactic elements, such as operators, keywords, and literal number/boolean values.

### Parsing

The parser is built as an [LL(1)](https://en.wikipedia.org/wiki/LL_parser) [recursive descent parser](https://en.wikipedia.org/wiki/Recursive_descent_parser), consuming the token stream from the scanner and producing an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representing the program. The central `parse()` method contains several local methods such as `parseBlock()`, `parseLogicalExpr()`, `parseFactor()`, etc., each of which use the closed-over `position` variable to advance through the `Array<Token>` given as input. These local methods are mutually recursive; to allow for easy detection of failure, when a parse error is detected, a custom `ParseError` object is thrown. This is caught at the top level of `parse()` and converted into a `ParseFailure` object, fitting the return type of `Either<ParseFailure, Program>`. The parser doesn't currently attempt to recover from errors; only one is reported at a time.

### Evaluation

The evaluator iterates through the list of statements in the `Program` produced by the parser, evaluating one at a time. Expressions are trees of sub-expressions; the evaluator performs a post-order traversal of an expression tree to evaluate it.

Function calls are evaluated using the `apply()` function. When a function is declared, it's evaluated to a `ClosureValue`, capturing the current environment at the time of its declaration. The environment is represented as a `Map<Identifier, Option<Value>>` object, containing the values of all declared variables/functions present at a given time; a value of `None` represents a variable that's been declared but not assigned a value, while a value of `Some(val)` represents that `val` has been assigned to that variable. Function calls are represented by `apply()`'ing a `ClosureValue` to an `Array<Value>`, where the array represents the arguments to the function call. This allows functions to be treated as first-class values which can be passed to and returned from other functions, as well as properly representing closures.

`printNum()`, `printBool()`, `readNum()`, `readBool()`, and `clock()` are provided as native functions by the interpreter, implemented in TS. The `NativeFunctionValue` type, when `apply()`'d, evaluates arbitrary TS code, then wraps the result (if any) in an appropriate `Value` type to pass it back into the Wheel environment.
