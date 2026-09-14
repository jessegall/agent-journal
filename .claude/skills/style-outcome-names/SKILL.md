---
name: style-outcome-names
description: "Use when unpacking a tuple[bool, str] result. This project's rule: Unpack an (ok, message) outcome as ok, in tests as well as the package"
---

# Naming an unpacked outcome

**The rule here:** Unpack an (ok, message) outcome as ok, in tests as well as the package

Decided in the coding style review (question 31). The package always writes ok; test_state.py and test_tracks.py mostly wrote took, which reads as a different thing for the same value.

Worked examples are in [reference/examples.md](reference/examples.md).
