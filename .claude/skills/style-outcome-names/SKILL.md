---
name: style-outcome-names
description: "Use when unpacking a tuple[bool, str] result. This project's rule: Unpack an (ok, message) outcome as ok; in a test file whose pass counter is the global ok, unpack it as took"
---

# Naming an unpacked outcome

**The rule here:** Unpack an (ok, message) outcome as ok; in a test file whose pass counter is the global ok, unpack it as took

Decided in the coding style review (question 31), and corrected when the code was brought in line: the package always writes ok, but the test files count their passing checks in a global named ok (`ok = fail = 0`, `global ok, fail` in check). A module-level `ok, msg = pins.add(...)` there would overwrite the counter and make the suite report the wrong totals, so those tests unpack as took, as test_state.py and test_tracks.py already do.

Worked examples are in [reference/examples.md](reference/examples.md).
