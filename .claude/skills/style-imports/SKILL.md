---
name: style-imports
description: "Use when adding an import to a Python file. This project's rule: Imports go at the top of the file; inside a function only to break an import cycle or keep a hook process from loading what it never uses"
---

# Where imports go

**The rule here:** Imports go at the top of the file; inside a function only to break an import cycle or keep a hook process from loading what it never uses

Decided in the coding style review (question 27). Top-level imports show a module's dependencies in one place; about 1,000 of the package's imports already sit there. The exceptions are real ones here: the hook runs as a fresh process on every tool call, so a module it only sometimes needs is imported where it is used, and sibling modules that import each other break the cycle the same way.

Worked examples are in [reference/examples.md](reference/examples.md).
