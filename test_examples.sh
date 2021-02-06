#!/bin/bash

isSuccessful="true"

for exampleDir in examples/*/ ; do
  if [ -f "$exampleDir/input" ]; then
    node dist/main.js -f "$exampleDir"/*.wheel -a 0 1 2 <"$exampleDir/input" >"$exampleDir/actual"
  else
    node dist/main.js -f "$exampleDir"/*.wheel -a 0 1 2 >"$exampleDir/actual"
  fi
  
  if ! diff -q "$exampleDir/expected" "$exampleDir/actual"; then
    isSuccessful="false"
  fi
done

if [ "$isSuccessful" == "true" ]; then
  exit 0
else
  exit 1
fi
