---
name: journal-test-draining
description: Work off the failed tests of a full run from one file, biggest cause first, with no full rerun until it is empty; read it when a full run has failures
---

# Draining failed tests

A full run that fails is drained, never run again until every failure is fixed.

1. Write every failed test of the run to one file, one test per line by its node id (`path::test`), read from the
   run's output with `journal output read <n>`.
2. Group the lines by cause: the same error, the same changed code, the same missing fixture. Put the biggest group
   first.
3. Fix the biggest groups first, one after another, with no test run in between: a cause shared by many tests is
   fixed once, at its source.
4. Then run small bounded runs of only the failed tests, by node id, a few groups at a time. Delete each line whose
   test passes.
5. Never run the full suite again until the file is empty. A test that fails for a new cause gets its own group.

When the file is empty, one full run proves the whole; a failure in it starts a new file.
