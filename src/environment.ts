import { insertAt, lookup, member } from "fp-ts/lib/Map";
import { isSome, none, Option, some } from "fp-ts/lib/Option";
import { Value } from "./evaluator_types";
import { eqIdentifier, Identifier } from "./universal_types";

export class Environment {
  private values: Map<Identifier, Option<Value>>;

  private parentEnvironment?: Environment;

  public constructor(parentEnvironment?: Environment) {
    this.values = new Map<Identifier, Option<Value>>();
    this.parentEnvironment = parentEnvironment;
  }

  public lookup = (ident: Identifier): Option<Option<Value>> => {
    const possibleLocalValue = lookup(eqIdentifier)(ident, this.values);

    if (isSome(possibleLocalValue)) {
      return possibleLocalValue;
    }

    if (this.parentEnvironment !== undefined) {
      return this.parentEnvironment.lookup(ident);
    }

    return none;
  };

  public define = (ident: Identifier): void => {
    this.values = insertAt(eqIdentifier)<Option<Value>>(ident, none)(this.values);
  };

  // set a variable's value in the innermost environment in which it's found; return true iff variable was found
  public assign = (ident: Identifier, value: Value): boolean => {
    if (member(eqIdentifier)(ident, this.values)) {
      this.values = insertAt(eqIdentifier)(ident, some(value))(this.values);
      return true;
    }

    if (this.parentEnvironment !== undefined) {
      return this.parentEnvironment.assign(ident, value);
    }

    return false;
  };
}
