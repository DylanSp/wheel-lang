import { Newtype, iso } from "newtype-ts";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Identifier extends Newtype<{ readonly Identifier: unique symbol }, string> {}

export const identifierIso = iso<Identifier>();
