---
name: style-js-strings
description: "Use when joining text and values in static/app.js. This project's rule: The viewer's JavaScript builds strings from pieces with template literals, not + concatenation"
---

# Building strings in the viewer

**The rule here:** The viewer's JavaScript builds strings from pieces with template literals, not + concatenation

Decided in the coding style review (question 29). Template literals are used hundreds of times in the viewer; + concatenation was left in 4 places.

Worked examples are in [reference/examples.md](reference/examples.md).
