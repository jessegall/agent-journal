---
name: UnitTestsStayInTheirUnit
description: Load it before writing an import in a unit test, so a unit test tests the building block in front of it and nothing behind its boundary.
summary: A unit test under tests/unit imports its own unit, core.base and the standard library; never a module of core/modules, the story builder or a story helper.
tier: mandatory
languages: [python]
---

# Unit tests stay in their unit

A unit test proves one building block on its own, with small samples of its own. Everything a module does, a
task, a plan, a message, is proved by stories through the story builder, never by a unit test. So a unit test
under `tests/unit/` imports only what it tests and what that stands on: `core.base`, `server` for the server's
unit tests, the standard library, and its own samples.

## When it fires

- **`test-unit-test-crosses-its-boundary`** - a file under `tests/unit/` imports `core.modules`, `core.testing` or
  anything under `tests.stories`. A module's own unit tests under `tests/unit/core/modules/` may import
  `core.modules`, to read the module's migrations, views and SQL; they still never import the story builder.

## How to fix it

- A unit test that needs a model writes a small sample model of its own in its folder's `samples/`, as the core's
  unit tests do with their items and shelves.
- A behaviour that needs a real module, its commands, guards or listeners is a story: move the test to
  `tests/stories/<domain>/` and write it with the story builder.
- A helper both kinds of test want lives in `core.base` when the product needs it, or is written twice in the two
  test folders when only tests need it; a unit test never reaches into a story's `support/` folder.
