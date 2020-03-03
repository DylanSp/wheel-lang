# Project Name To Be Determined

TODO: Introduction, purpose of the project.

## How to Run \$LANGUAGE Programs

1. Clone the repo.
1. Install dependencies with `yarn install`/`npm install`.
1. Build the interpreter with `yarn build`/`npm run build`.
1. Run a program with `node dist/main.js [path/to/program]`; for example, to run the example of an addition function, use `node dist/main.js examples/adder.program`.

## Programming in \$LANGUAGE

### Syntax

Programs in \$LANGUAGE are composed of a block of statements, following a JavaScript-esque syntax. The top-level block must have braces surrounding it. There are five types of statements:

- Function declarations, following Javascript function declaration syntax:

```
function f(x)
{
  return x;
}
```

- Return statements:

```
return 1;
```

- Variable assignments: (May be changed; see [issue #15.](https://github.com/DylanSp/extended-four-function-console/issues/15))
- If statements. Braces around the body are mandatory, as is an `else` block. Example:

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

- While statements. Braces around the body are mandatory. Example:

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

Operator precedence:
TODO (reference in docs folder)

Reserved keywords:

- `function`
- `return`
- `if`
- `else`
- `while`
- `true`
- `false`

TODO: reference to Nearley grammar in docs folder

### Semantics

TODO: Generally JS-like.

- Variables are mutable
- Higher-order functions are supported
- No strings
- No collection/object types
- No custom types
- `==`, `/=` only operate on two operands of the same type
- `!` only operates on booleans

\$LANGUAGE has no `print`/`log`/`console` statements; the only way to get a value out of a program is by returning it from the program's top level. The driver in `src/main.ts` handles this; it scans, parses, and evaluates a program, printing the returned result if all steps are successful (and the error(s), if not).

## Language Design Notes

TODO

## Implementation Notes

TODO
