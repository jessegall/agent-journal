"""Every name a module uses is one it defined or imported, and nothing imports a name that is not there.

scripts/checks/imports.py proves that an IMPORTED name exists. It cannot see a name a module USES and
never imported, nor a file that does not parse at all - the two faults that reached this branch on
2026-10-12, both from edits that moved a constant and left one call site behind.
"""

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
WATCHED = ("src", "tests", "scripts")
WANTED = ("undefined name", "invalid syntax", "unexpected indent", "IndentationError", "SyntaxError")


def complaints() -> list[str]:
    run = subprocess.run([sys.executable, "-m", "pyflakes", *WATCHED], capture_output=True, text=True, cwd=HERE)
    return [line for line in run.stdout.splitlines() if any(word in line for word in WANTED)]


if __name__ == "__main__":
    found = complaints()
    print("\n".join(found) or "every name used is defined or imported, and every file parses")
    sys.exit(1 if found else 0)
