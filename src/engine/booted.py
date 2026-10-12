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


def _kept(root: Path, name: str, walk) -> list[str]:
    path = runtime.folder(root) / BOOT_FILE
    digest = noticed_digest(root)
    held = read_json(path, dict, {})
    if held.get("digest") == digest and isinstance(held.get(name), list):
        return [str(line) for line in held[name]]
    lines = walk()
    write_json(path, {**(held if held.get("digest") == digest else {}), "digest": digest, name: lines})
    return lines
