import { Newtype, iso, getEq, getOrd } from "newtype-ts";
import { eqString } from "fp-ts/lib/Eq";
import { ordString } from "fp-ts/lib/Ord";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Identifier extends Newtype<{ readonly Identifier: unique symbol }, string> {}

export const identifierIso = iso<Identifier>();
export const eqIdentifier = getEq<Identifier>(eqString);
export const ordIdentifier = getOrd<Identifier>(ordString);
