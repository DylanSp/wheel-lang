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

## Implementation Notes

TODO
