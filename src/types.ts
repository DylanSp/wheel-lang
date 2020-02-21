import { Newtype, iso, getEq } from "newtype-ts";
import { eqString } from "fp-ts/lib/Eq";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Identifier extends Newtype<{ readonly Identifier: unique symbol }, string> {}

export const identifierIso = iso<Identifier>();
export const eqIdentifier = getEq(eqString);
