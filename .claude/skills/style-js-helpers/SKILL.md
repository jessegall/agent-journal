---
name: style-js-helpers
description: "Use when adding a helper function to the viewer's JavaScript. This project's rule: A top-level helper in static/app.js is a function declaration, not a const arrow function"
---

# Helper functions in the viewer

**The rule here:** A top-level helper in static/app.js is a function declaration, not a const arrow function

Decided in the coding style review (question 28). 25 of the viewer's top-level helpers are function declarations and 4 are const arrows. Arrow functions inside a component's setup are not covered by this rule.

Worked examples are in [reference/examples.md](reference/examples.md).
