---
name: style-module-docstrings
description: "Use when creating a Python module, or editing the top of one. This project's rule: A module has no module docstring; the file opens on its imports"
---

# What a module says about itself at the top

**The rule here:** A module has no module docstring; the file opens on its imports

Decided by the user in the coding style review (question 26). The file's name and its code say what it is. An explanation of a design choice goes in a short comment where the choice is made, not in an essay at the top of the file. Older modules such as state.py and pins.py still open with long docstrings; they are not rewritten just for this, but a module being created or reworked follows the rule.

Worked examples are in [reference/examples.md](reference/examples.md).
