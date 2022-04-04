# WheelLang v0.3

The wheel. I reinvented it.

More seriously, this is a small toy programming language, built to demonstrate and practice techniques for implementing basic imperative and object-oriented languages. Not to be used in production, not to be confused with Python wheels.

## How to Run Wheel Programs

The only external dependencies for building and using this language are `node` and either `npm` or `yarn`. All other dependencies will be installed locally from `package.json`, including TypeScript.

1. Clone the repo.
1. Install dependencies with `npm ci`/`yarn install`.
1. Build the interpreter with `npm run build`/`yarn build`.
1. Run a program with `node dist/main.js -f sourceFile1 sourceFile2 ... [-a commandLineArg1 commandLineArg2 ...]`. Source files can be listed in any order, regardless of dependencies. Examples:
   1. Running a single-file program: `node dist/main.js -f examples/adder/adder.wheel`.
   1. Running a multi-file program: `node dist/main.js -f examples/modules_basic/basic_module.wheel examples/modules_basic/basic_consumer.wheel`.
   1. Running a program with command-line arguments: `node dist/main.js -f examples/cli_arguments/command_line_arguments.wheel -a 0 1 2`.

## Example Programs

Each subdirectory of the [`examples`](examples) directory contains a Wheel program, with some number of modules in files with the extension `.wheel`. Each directory also contains a plain text file called `expected`; this is used as the expected output in CI tests to ensure that the example programs perform appropriately. The easiest way to execute an example program is `node dist/main.js -f examples/[example subdirectory name]/*.wheel`.

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

Expressions can have number, boolean, string, object, and `null` values, as well as variable references. Supported operators:

- Arithmetic: `+`, `-`, `*`, `/`
- Logical: `&`, `|`, `!` (Note that logical and/or use a single character, not `&&`/`||`)
- Relational: `<`, `>`, `<=`, `>=`, `==`, `/=` (last operator is the not-equal operator)
- Object field access: `.`

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
- `module`
- `import`
- `export`
- `class`
- `constructor`

For a somewhat more formal specification of the grammar, see `docs/grammar.ne`, which goes over the grammar's structure, using the format of [nearley.js](https://nearley.js.org/). It can be explored by pasting it into the [Nearley Parser Playground](https://omrelli.ug/nearley-playground/), though this version of the grammar doesn't include any whitespace, so the generated examples will be hard to read.

### Semantics

Wheel is dynamically typed, supporting several types of values: numbers (double-precision IEEE 754 floats), booleans, strings, functions, objects, and `null`. The language uses typical imperative-style control flow; `if` and `while` work the same as in other imperative languages.

A program is composed of a module named `Main`, as well as any other modules passed in to the interpreter. The entrypoint for Wheel programs is at the beginning of the `Main` module. Other modules are evaluated when first imported, then their exported values are cached for any subsequent import statements. This means that any top-level statements in an imported module will be executed at most once, not on each import.

A few general notes:

- All variables are mutable; there's no `const`.
- Higher-order functions are supported; you can pass functions as arguments to other functions, and functions can return other functions.
- The `==` and `/=` operators only operate on two operands of the same type.
- The `!` operator only operates on booleans.
- There are two flavors of Wheel objects.
  - Objects declared with the object literal syntax `{}` are comparable to (dynamically-typed) C structs; they're bags of data, nothing more. These objects can have functions assigned to fields, but these functions are not true object methods; they don't have a built-in `this` reference to the object.
  - Objects created by invoking a class's constructor (new in v0.3) are true objects in the OOP sense. They have access to the defined methods, which can reference the invoking object with `this`.
- Accessing an undeclared field on an object returns null, i.e. `{ return {}.field; }` returns `null`.
- Fields do not have to be declared on an object's initial declaration/initialization to be set. `{ let obj = {}; obj.a = 1; }` is a legal program.

Wheel has several "native" functions, provided by the interpreter, for I/O, parsing, and time measurement. These functions are defined in the `Native` module.

- `readString()`: takes no arguments, displays a prompt character, reads a string from stdin, and returns the string.
- `print()`: takes a single argument of any type and prints its value to stdout.
- `parseNum()`: takes a single string argument and returns an object. If the input parses correctly, the function returns an object with an `isValid` field set to `true` and a `value` field with the parsed value; if the input does not parse, it returns an object with an `isValid` field set to `false`. Parsing follows the rules of Node.js's `parseFloat()`.
- `clock()`: takes no arguments, returns the number of milliseconds since the start of the Unix epoch. (Yes, it's just a wrapper for JS's `Date.now()`).

Wheel also has a small standard library, defined in the `wheel_stdlib` directory.

- `StdParser` module:
  - `parseBool()`: takes a single string argument and returns an object, similar to `parseNum()`. `parseBool()` recognizes `"true"` and `"false"` (with that exact lack of capitalization), and rejects all other input.
- `StdReader` module:
  - `readNum()`: reads input with `readString()` and immediately attempts to parse it with `parseNum()`.
  - `readBool()`: reads input with `readString()` and immediately attempts to parse it with `parseBool()`.
- `StdCollections` module:
  - `LinkedList` class. This is a doubly-linked list that can contain values of any type. The class has the following methods:
    - `pushStart()`: prepends a single value to the start of the list.
    - `pushEnd()`: appends a single value to the end of the list.
    - `popStart()`: removes the value at the start of the list and returns it. Throws an error when called on an empty list.
    - `popEnd()`: removes the value at the end of the list and returns it. Throws an error when called on an empty list.
    - `valueAt()`: takes a number representing a 0-based index, returns the value at that position in the list. Returns `null` if the index is out of bounds.
    - `forEach()`: takes a function and runs it on every element of the list.
    - `print()`: prints a representation of the list to stdout.

The command-line arguments provided to a Wheel program (via the interpreter's `-a` option) are passed in as a `LinkedList` of strings, assigned to the variable `args` in the module `Args`.

## Implementation/Architecture Notes

The Wheel interpreter is built as a composition of five modules: scanning/lexing, parsing, desugaring, cycle checking, and evaluation. [`full_pipeline`](src/full_pipeline.ts) feeds an array of string inputs, one entry per Wheel module, through the interpreter, aborting at the first error. [`main`](src/main.ts) acts as the top-level driver, reading program files into memory, loading the standard library, running the pipeline, and reporting the result/errors.

The three primary modules (scanner, parser, evaluator) are each built around central functions, which either report an error or produce a type to be consumed by the next module. `scan()` and `parseModule()` are pure functions; `evaluateProgram()` may run impure native functions, if they're provided as arguments. This design allows for a small API surface, with each function having a single responsibility, limited external dependencies, and no side effects. This allows for extensive unit testing; for examples of how each module is used, consult the `test` directory. Additionally, these modules have separate files defining and exporting the types they use. [`universal_types`](src/universal_types.ts) contains types used by multiple modules.

### Scanning

The scanner is relatively straightforward; it uses regexes and string equality checks to work through the input string, emitting an array of tokens (or invalid characters). These tokens denote various syntactic elements, such as operators, keywords, and literal number/boolean/string/object values.

### Parsing

The parser is built as an [LL(1)](https://en.wikipedia.org/wiki/LL_parser) [recursive descent parser](https://en.wikipedia.org/wiki/Recursive_descent_parser), consuming the token stream from the scanner and producing an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representing the program. The central `parseModule()` method contains several local methods such as `parseBlock()`, `parseLogicalExpr()`, `parseFactor()`, etc., each of which use the closed-over `position` variable to advance through the `Array<Token>` given as input. These local methods are mutually recursive; to allow for easy detection of failure, when a parse error is detected, a custom `ParseError` object is thrown. This is caught at the top level of `parse()` and converted into a `ParseFailure` object, fitting the return type of `Either<ParseFailure, Program>`. The parser doesn't currently attempt to recover from errors; only one is reported at a time.

### Desugaring

As of v0.3, there is only one desugaring pass, which desugars class declarations into regular functions. This design allows for simplifying the evaluator, which doesn't need to know about class declarations.

The class desugaring pass is detailed in [this issue comment](https://github.com/DylanSp/wheel-lang/issues/43#issuecomment-757397523) on GitHub. In short, it takes advantage of higher-order functions to transform a method that might use the `this` keyword into a closure, returned by a factory function that takes a single argument named `this`. The user-provided constructor code is augmented to create a basic Wheel object, call the method factory functions on that object, then assign the returned closures to fields on the object.

### Cycle Checking

This pass does a simple check for circular dependencies. It extracts `import` and `export` statements from the parsed modules, uses them to construct a graph of the modules, then checks that graph for cycles.

### Evaluation

The evaluator iterates through the list of statements in the `Program` produced by the parser, evaluating one at a time. Expressions are trees of sub-expressions; the evaluator performs a post-order traversal of an expression tree to evaluate it.

Function calls are evaluated using the `apply()` function. When a function is declared, it's evaluated to a `ClosureValue`, capturing the current environment at the time of its declaration. The environment is represented as an `Environment` object, which wraps a `Map<Identifier, Option<Value>>` containing the values of all declared variables/functions present at a given time; a value of `None` represents a variable that's been declared but not assigned a value, while a value of `Some(val)` represents that `val` has been assigned to that variable. Function calls are represented by `apply()`'ing a `ClosureValue` to an `Array<Value>`, where the array represents the arguments to the function call. This allows functions to be treated as first-class values which can be passed to and returned from other functions, as well as properly representing closures.

`print`, `readString()`, `parseNum()`, and `clock()` are provided as native functions by the interpreter, implemented in TS. The `NativeFunctionValue` type, when `apply()`'d, evaluates arbitrary TS code, then wraps the result (if any) in an appropriate `Value` type to pass it back into the Wheel environment.

### Testing

The Wheel interpreter contains extensive unit tests, located in the [`test`](test) directory. Additionally, each example program can be tested against expected output; this is run by CI using the [`test_examples.sh`](test_examples.sh) script.
