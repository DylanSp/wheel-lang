import { isNone } from "fp-ts/lib/Option";
import { insertAt, lookup } from "fp-ts/lib/Map";
import { insert } from "fp-ts/lib/Set";
import { Identifier, eqIdentifier } from "./types";
import { Module, Block } from "./parser";
import { NATIVE_MODULE_NAME } from "./evaluator";

class ModuleGraph {
  private dependencies: Map<Identifier, Set<Identifier>>; // map of module names to what module names import the key module

  constructor(modules: Array<Module>) {
    this.dependencies = new Map<Identifier, Set<Identifier>>();

    // initialize sets of importing modules
    modules.forEach((module) => {
      this.dependencies = insertAt(eqIdentifier)(module.name, new Set<Identifier>())(this.dependencies);
    });

    // load importing modules into dependencies
    modules.forEach((module) => {
      const importedModuleNames = this.getImportList(module.body);
      importedModuleNames
        .filter((name) => name != NATIVE_MODULE_NAME)
        .forEach((importedModuleName) => {
          const exportingModule = lookup(eqIdentifier)(importedModuleName)(this.dependencies);
          if (isNone(exportingModule)) {
            throw new Error("Programming error, imported module was not previously loaded");
          }

          const newImports = insert(eqIdentifier)(module.name)(exportingModule.value);
          this.dependencies = insertAt(eqIdentifier)(importedModuleName, newImports)(this.dependencies);
        });
    });
  }

  private getImportList = (block: Block): Array<Identifier> => {
    const importedModuleNames: Array<Identifier> = [];

    for (const statement of block) {
      if (statement.statementKind === "import") {
        importedModuleNames.push(statement.moduleName);
      } else if (statement.statementKind === "funcDecl") {
        importedModuleNames.concat(this.getImportList(statement.body));
      } else if (statement.statementKind === "if") {
        importedModuleNames.concat(this.getImportList(statement.trueBody));
        importedModuleNames.concat(this.getImportList(statement.falseBody));
      } else if (statement.statementKind === "while") {
        importedModuleNames.concat(this.getImportList(statement.body));
      }
      // no other statement kinds contain other statements
    }

    return importedModuleNames;
  };

  public checkForCycles = (): boolean => {
    if (this.dependencies.size === 0) {
      return false;
    }

    // unvisited = white
    // working = gray
    // finished = black
    type Status = "unvisited" | "working" | "finished";

    const modulesWithStatus = new Map<Identifier, Status>();
    for (const moduleName of this.dependencies.keys()) {
      modulesWithStatus.set(moduleName, "unvisited");
    }

    // basic algorithm: see slide 5 of http://www.cs.nott.ac.uk/~psznza/G5BADS03/graphs2.pdf
    while (Array.from(modulesWithStatus).some(([, status]) => status === "unvisited")) {
      const workingStack: Array<Identifier> = [];

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [startingModuleName] = Array.from(modulesWithStatus).find(([, status]) => status === "unvisited")!; // will be defined by while-loop condition

      modulesWithStatus.set(startingModuleName, "working");
      workingStack.push(startingModuleName);

      while (workingStack.length !== 0) {
        const top = workingStack[workingStack.length - 1];

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dependentModules = this.dependencies.get(top)!; // should be defined because all modules are loaded
        if (Array.from(dependentModules).some((dependency) => modulesWithStatus.get(dependency) === "working")) {
          return true;
        }

        const possibleUnvisited = Array.from(dependentModules).find(
          (dependency) => modulesWithStatus.get(dependency) === "unvisited",
        );
        if (possibleUnvisited !== undefined) {
          modulesWithStatus.set(possibleUnvisited, "working");
          workingStack.push(possibleUnvisited);
        } else {
          modulesWithStatus.set(top, "finished");
          workingStack.pop();
        }
      }
    }

    return false;
  };
}

// returns true iff a cycle is present
export const isCyclicDependencyPresent = (modules: Array<Module>): boolean => {
  const moduleGraph = new ModuleGraph(modules);
  return moduleGraph.checkForCycles();
};
