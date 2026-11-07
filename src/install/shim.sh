#!/bin/sh
# The journal command of a person's machine: it runs the journal of the project in this folder or above. A version 5
# project keeps its command at .journal/bin/journal, or at the .journal/journal that runs it; a version 4 project at
# .journal/journal or .journal/src/journal.sh.
dir="$PWD"
while :; do
  if [ -x "$dir/.journal/bin/journal" ]; then
    exec "$dir/.journal/bin/journal" "$@"
  fi
  if [ -x "$dir/.journal/journal" ]; then
    exec "$dir/.journal/journal" "$@"
  fi
  if [ -f "$dir/.journal/src/journal.sh" ]; then
    JOURNAL_ROOT="$dir" exec sh "$dir/.journal/src/journal.sh" "$@"
  fi
  [ "$dir" = / ] && break
  dir=$(dirname "$dir")
done
echo "no .journal/ here or above: install agent-journal in this project first" >&2
exit 1
