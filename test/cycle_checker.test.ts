import "jest";
import { Module } from "../src/parser";
import { identifierIso } from "../src/types";
import { isCyclicDependencyPresent } from "../src/cycle_checker";

describe("Cycle checker", () => {
  describe("Module graphs with cycles", () => {
    it("Detects a simple two-node cycle", () => {
      // Arrange
      const modules: Array<Module> = [
        {
          name: identifierIso.wrap("ModuleA"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("ModuleB"),
              imports: [identifierIso.wrap("bExport")],
            },
          ],
          exports: [identifierIso.wrap("aExport")],
        },
        {
          name: identifierIso.wrap("ModuleB"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("ModuleA"),
              imports: [identifierIso.wrap("aExport")],
            },
          ],
          exports: [identifierIso.wrap("bExport")],
        },
      ];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(true);
    });

    it("Detects a simple three-node cycle", () => {
      // Arrange
      const modules: Array<Module> = [
        {
          name: identifierIso.wrap("ModuleA"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("ModuleB"),
              imports: [identifierIso.wrap("bExport")],
            },
          ],
          exports: [identifierIso.wrap("aExport")],
        },
        {
          name: identifierIso.wrap("ModuleB"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("ModuleC"),
              imports: [identifierIso.wrap("cExport")],
            },
          ],
          exports: [identifierIso.wrap("bExport")],
        },
        {
          name: identifierIso.wrap("ModuleC"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("ModuleA"),
              imports: [identifierIso.wrap("aExport")],
            },
          ],
          exports: [identifierIso.wrap("cExport")],
        },
      ];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(true);
    });
  });

  describe("Module graphs without cycles", () => {
    it("Detects no cycles if input array is empty", () => {
      // Arrange
      const modules: Array<Module> = [];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(false);
    });

    it("Detects no cycles in a single-module graph", () => {
      // Arrange
      const modules: Array<Module> = [
        {
          name: identifierIso.wrap("Main"),
          body: [],
          exports: [],
        },
      ];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(false);
    });

    it("Detects no cycles in a chain of two modules", () => {
      // Arrange
      const modules: Array<Module> = [
        {
          name: identifierIso.wrap("Main"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("Source"),
              imports: [identifierIso.wrap("sourceExport")],
            },
          ],
          exports: [],
        },
        {
          name: identifierIso.wrap("Source"),
          body: [],
          exports: [identifierIso.wrap("sourceExport")],
        },
      ];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(false);
    });

    // same modules as previous test, just in different order
    it("Detects no cycles in a chain of two modules, regardless of order", () => {
      // Arrange
      const modules: Array<Module> = [
        {
          name: identifierIso.wrap("Source"),
          body: [],
          exports: [identifierIso.wrap("sourceExport")],
        },
        {
          name: identifierIso.wrap("Main"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("Source"),
              imports: [identifierIso.wrap("sourceExport")],
            },
          ],
          exports: [],
        },
      ];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(false);
    });

    it("Detects no cycles in a chain of three modules", () => {
      // Arrange
      const modules: Array<Module> = [
        {
          name: identifierIso.wrap("Main"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("ModuleB"),
              imports: [identifierIso.wrap("bExport")],
            },
          ],
          exports: [],
        },
        {
          name: identifierIso.wrap("ModuleB"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("ModuleA"),
              imports: [identifierIso.wrap("aExport")],
            },
          ],
          exports: [identifierIso.wrap("bExport")],
        },
        {
          name: identifierIso.wrap("ModuleA"),
          body: [],
          exports: [identifierIso.wrap("aExport")],
        },
      ];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(false);
    });

    it("Detects no cycles in a diamond graph", () => {
      // Arrange
      const modules: Array<Module> = [
        {
          name: identifierIso.wrap("Main"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("IntermediateA"),
              imports: [identifierIso.wrap("aExport")],
            },
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("IntermediateB"),
              imports: [identifierIso.wrap("bExport")],
            },
          ],
          exports: [],
        },
        {
          name: identifierIso.wrap("IntermediateA"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("Source"),
              imports: [identifierIso.wrap("sourceExport")],
            },
          ],
          exports: [identifierIso.wrap("aExport")],
        },
        {
          name: identifierIso.wrap("IntermediateB"),
          body: [
            {
              statementKind: "import",
              moduleName: identifierIso.wrap("Source"),
              imports: [identifierIso.wrap("sourceExport")],
            },
          ],
          exports: [identifierIso.wrap("bExport")],
        },
        {
          name: identifierIso.wrap("Source"),
          body: [],
          exports: [identifierIso.wrap("sourceExport")],
        },
      ];

      // Act
      const isCyclic = isCyclicDependencyPresent(modules);

      // Assert
      expect(isCyclic).toBe(false);
    });
  });
});
