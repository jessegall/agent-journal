---
name: journal-checks
description: Write and run scripts that pass or fail about the project; read it when a check is made, run or fails
---

# Checks

A check is a script that passes or fails, run by hand or every so many minutes.

- `journal check make "<title>" --command "<shell>" --every <minutes> --brief "<what it checks and what a failure means>"`.
- `journal check run <n>` runs it now; `journal check list` shows how each last went; `journal check runs <n>` shows when
  it ran and what each run printed.
- `journal check stop <n>` stops it from running until a user starts it again.
- `journal check start <n>` starts a stopped check again, so it runs on its next due round. Only a user starts one: an
  agent is refused, so ask the user to press Start on the Checks window.
- `journal check edit <n> --title "<title>" --command "<shell>" --brief "<why>" --every <minutes>` changes the fields you name.
- `journal check remove <n>` retires it: it runs no more and leaves the list.
- When a check fails, fix what it found before anything else, then run it again.
