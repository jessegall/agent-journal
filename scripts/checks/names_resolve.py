"""Every name a module uses is one it defined or imported, and every file parses.

scripts/checks/imports.py proves that an IMPORTED name exists. It cannot see a name a module USES
and never imported, nor a file that does not parse at all - the two faults that reached a branch on
2026-10-12, both from edits that moved a definition and left a call site behind, and the same shape
as the scripted rename that cost 354 test failures the night before.
"""

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[2]
WATCHED = ("src", "tests", "scripts")
WANTED = ("undefined name", "invalid syntax", "unexpected indent", "IndentationError", "SyntaxError")


class PyflakesIsNotHere(RuntimeError):
    @classmethod
    def of(cls, said: str) -> "PyflakesIsNotHere":
        return cls(f"this check reads pyflakes and {sys.executable} cannot run it, so it would pass in silence: {said}")


def complaints() -> list[str]:
    """What pyflakes says about the watched trees, kept to the kinds this check is for."""
    run = subprocess.run([sys.executable, "-m", "pyflakes", *WATCHED], capture_output=True, text=True, cwd=HERE)
    if "No module named" in run.stderr or run.returncode not in (0, 1):
        raise PyflakesIsNotHere.of(run.stderr.strip().splitlines()[-1] if run.stderr.strip() else f"exit {run.returncode}")
    return [line for line in run.stdout.splitlines() if any(word in line for word in WANTED)]


def probe() -> None:
    """Proves the check sees the fault it exists for, since a check that cannot fail says nothing."""
    bad = HERE / "src" / "_probe_names_resolve.py"
    bad.write_text("def said():\n    return markmark_file()\n")
    try:
        assert any("markmark_file" in line for line in complaints()), "the check did not see an undefined name"
    finally:
        bad.unlink()
    assert not any("_probe_names_resolve" in line for line in complaints()), "the check still names a file that is gone"
    print("the check names an undefined name, and is silent once it is gone")


if __name__ == "__main__":
    if "--probe" in sys.argv:
        probe()
        raise SystemExit(0)
    found = complaints()
    print("\n".join(found) or "every name used is defined or imported, and every file parses")
    sys.exit(1 if found else 0)
