# WheelLang

The wheel. I reinvented it.

More seriously, this is a small toy programming language, built to demonstrate and practice techniques for implementing basic imperative languages. Not to be used in production, not to be confused with Python wheels.

## How to Run Wheel Programs

The only external dependencies for building and using this language are `node` and either `npm` or `yarn`. All other dependencies will be installed locally from `package.json`, including TypeScript.

1. Clone the repo.
1. Install dependencies with `yarn install`/`npm install`.
1. Build the interpreter with `yarn build`/`npm run build`.
1. Run a program with `node dist/main.js [path/to/program]`; for example, to run the example of an addition function, use `node dist/main.js examples/adder.program`.

## Programming in Wheel

### Syntax

Programs in Wheel are composed of a block of statements, following a JavaScript-esque syntax. The top-level block must have braces surrounding it. There are five types of statements:

1. Function declarations, following Javascript function declaration syntax. Example:

```
function f(x)
{
  return x;
}
```

2. Return statements:

```
return 1;
```

3. Variable assignments: (May be changed; see [issue #15.](https://github.com/DylanSp/extended-four-function-console/issues/15))

4. If statements. Braces around the body are mandatory, as is an `else` block. Example:

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

5. While statements. Braces around the body are mandatory. Example:

```
while (x < 2)
{
  y = y + 5;
  x = x + 1;
}
```

Expressions can have number and boolean values, as well as variable references. Supported operators:

- Arithmetic: `+`, `-`, `*`, `/`
- Logical: `&`, `|`, `!` (Note that logical and/or use a single character, not `&&`/`||`)
- Relational: `<`, `>`, `<=`, `>=`, `==`, `/=` (last operator is the not-equal operator)

Operator precedence is documented in [`docs/precedence.md`](docs/precedence.md).

Reserved keywords:

- `function`
- `return`
- `if`
- `else`
- `while`
- `true`
- `false`

For a somewhat more formal specification of the grammar, see `docs/grammar.ne`, which goes over the grammar's structure, using the format of [nearley.js](https://nearley.js.org/); it can be explored by pasting it into the [Nearley Parser Playground](https://omrelli.ug/nearley-playground/). This version of the grammar doesn't include any whitespace, though, so the generated examples will be hard to read.

### Semantics

Generally, Wheel behaves like you'd expect it to. The only types are numbers, booleans, and functions; no strings, no collections, no objects. Wheel is currently dynamically typed; [issue #14](https://github.com/DylanSp/extended-four-function-console/issues/14) covers a possible addition of static typing. A few notes:

- All variables are mutable; there's no `const`.
- Higher-order functions are supported.
- The `==` and `/=` operators only operate on two operands of the same type.
- The `!` operator only operates on booleans.

Wheel has no `print`/`log`/`console` statements (currently; follow [issue #18](https://github.com/DylanSp/extended-four-function-console/issues/18) for work on this); the only way to get a value out of a program is by returning it from the program's top level. The driver in `src/main.ts` handles this; it scans, parses, and evaluates a program, printing the returned result if all steps are successful (and the error(s), if not).

## Implementation/Architecture Notes

The Wheel interpreter is built as a composition of three modules: scanning/lexing, parsing, and evaluation. [`full_pipeline`](src/full_pipeline.ts) feeds a string input through the three modules, aborting at the first error. [`main`](src/main.ts) acts as the top-level driver, reading a program file into memory, running the pipeline, and reporting the result/errors.

Each of the modules is built around a single central pure function, which either reports an error or produces a type to be consumed by the next module. This design allows for a small API surface, with each function having a single responsibility, no external dependencies, and no side effects. This allows for extensive unit testing; for examples of how each module is used, consult the `test` directory.

In addition to the central functions, each module also exports the types required to consume its output. [`types`](src/types.ts) contains types used by multiple modules.

### Scanning

The scanner is relatively straightforward; it uses regexes and string equality checks to work through the input string, emitting an array of tokens (or invalid characters). These tokens denote various syntactic elements, such as operators, keywords, and literal number/boolean values.

### Parsing

The parser is built as an [LL(1)](https://en.wikipedia.org/wiki/LL_parser) [recursive descent parser](https://en.wikipedia.org/wiki/Recursive_descent_parser), consuming the token stream from the scanner and producing an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representing the program. The central `parse()` method contains several local methods such as `parseBlock()`, `parseLogicalExpr()`, `parseFactor()`, etc., each of which use the closed-over `position` variable to advance through the `Array<Token>` given as input. These local methods are mutually recursive; to allow for easy detection of failure, when a parse error is detected, a custom `ParseError` object is thrown. This is caught at the top level of `parse()` and converted into a `ParseFailure` object, fitting the return type of `Either<ParseFailure, Program>`. The parser doesn't currently attempt to recover from errors; only one is reported at a time.

### Evaluation

The evaluator iterates through the list of statements in the `Program` produced by the parser, evaluating one at a time. Expressions are trees of sub-expressions; the evaluator performs a post-order traversal of an expression tree to evaluate it.

The one subtlety concerns how function declarations and calls are evaluated. When a function is declared, it's evaluated to a `ClosureValue`, capturing the current environment at the time of its declaration. The environment is represented as a `Map<Identifier, Value>` object, containing the values of all declared variables/functions present at a given time. Function calls are represented by `apply()`'ing a `ClosureValue` to an `Array<Value>`, where the array represents the arguments to the function call. This allows functions to be treated as first-class values which can be passed to and returned from other functions, as well as properly representing closures.
