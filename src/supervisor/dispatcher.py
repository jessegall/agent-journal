from pathlib import Path

TEXT = """#!/bin/sh
# agent-journal: the journal command. It finds the project by its .journal folder, walking up from here, and runs
# the journal that project holds, whichever version: nothing of the journal itself lives outside a project.
dir="$(pwd)"
while [ "$dir" != "/" ]; do
    if [ -f "$dir/.journal/src/journal.sh" ]; then
        JOURNAL_ROOT="$dir" exec sh "$dir/.journal/src/journal.sh" "$@"
    fi
    if [ -x "$dir/.journal/journal" ]; then
        exec "$dir/.journal/journal" "$@"
    fi
    dir="$(dirname "$dir")"
done
echo "no .journal/ here or above: install agent-journal in this project first" >&2
exit 1
"""


class Dispatcher:
    """The one command outside a project, at ~/.local/bin/journal: it only finds the project's own journal and hands over to it, version 4's shim or version 3's launcher."""

    def __init__(self, home: Path) -> None:
        self.path = home / ".local" / "bin" / "journal"

    def write(self) -> Path | None:
        """Written when ~/.local/bin exists; the same text is left alone."""
        if not self.path.parent.is_dir():
            return None
        if not self.path.is_file() or self.path.read_text() != TEXT:
            self.path.write_text(TEXT)
            self.path.chmod(0o755)
        return self.path
