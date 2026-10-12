"""What the boot worked out, kept for the build it was worked out on.

Every command boots a journal, and walking three hundred feature files costs about half a second,
which is more than a command is allowed. The server walks once; everything else reads one file.
"""

from pathlib import Path

from engine import runtime
from engine.disk import read_json
from engine.package import noticed_digest
from engine.stored import write_json

BOOT_FILE = "boot.json"


def boundaries(root: Path, where: Path) -> list[str]:
    """What the features reach for, walked once for a build and read from the file after that."""
    from declaring.boundaries import report
    return _kept(root, "boundaries", lambda: report(where))


def grown(root: Path, where: Path) -> list[str]:
    """What a feature has newly reached for since the baseline was taken. The list only ever shrinks while plan 33 runs, so anything here is a boundary being crossed again."""
    from declaring.boundaries import grew, lines_of, reached
    path = runtime.folder(root) / BOOT_FILE
    held = read_json(path, dict, {})
    before = [str(line) for line in held.get("reaches", [])]
    if not before:
        return []
    return grew(reached(where), before)


def baseline(root: Path, where: Path) -> int:
    """Writes what the features reach for today as the line the walk holds them to, and says how many."""
    from declaring.boundaries import lines_of, reached
    path = runtime.folder(root) / BOOT_FILE
    held = read_json(path, dict, {})
    lines = lines_of(reached(where))
    write_json(path, {**held, "digest": noticed_digest(root), "reaches": lines})
    return len(lines)


def _kept(root: Path, name: str, walk) -> list[str]:
    path = runtime.folder(root) / BOOT_FILE
    digest = noticed_digest(root)
    held = read_json(path, dict, {})
    if held.get("digest") == digest and isinstance(held.get(name), list):
        return [str(line) for line in held[name]]
    lines = walk()
    write_json(path, {**(held if held.get("digest") == digest else {}), "digest": digest, name: lines})
    return lines
