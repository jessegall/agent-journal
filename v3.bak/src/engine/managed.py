"""What the journal manages in a file it writes into a project, and the record of those files' hashes; the core the hook wiring and the install both use."""

import hashlib
import json
import re
from pathlib import Path

from resources.hook_commands import journal_hook
from resources.memo import Memo

MANAGED = "managed-files.json"
CURRENT = re.compile(r"<!-- BEGIN: agent-journal, form (\d+) [^\n]*-->.*?<!-- END: agent-journal, form \1 -->", re.DOTALL)
HASHES = Memo()


def read_whole(path: Path) -> bytes:
    """A file an upgrade removed between listing and reading is a removed file: it holds nothing."""
    try:
        return path.read_bytes()
    except FileNotFoundError:
        return b""


def managed_bytes(path: Path) -> bytes:
    if path.name in ("settings.local.json", "hooks.json"):
        settings = json.loads(path.read_text())
        hooks = {event: [block for block in blocks if journal_hook(json.dumps(block))]
                 for event, blocks in (settings.get("hooks") or {}).items()}
        status = settings.get("statusLine", {})
        managed = {"hooks": {event: blocks for event, blocks in hooks.items() if blocks}}
        if "claude-status.sh" in json.dumps(status):
            managed["statusLine"] = status
        return json.dumps(managed, sort_keys=True).encode()
    if path.name not in ("CLAUDE.md", "AGENTS.md"):
        return read_whole(path)
    text = path.read_text(errors="replace")
    return "\n".join(match.group() for match in CURRENT.finditer(text)).encode()


HASHES = Memo()


def managed_hash(path: Path) -> str:
    """The hash of what the journal manages in a file, made again only when the file's time or size changed."""
    try:
        found = path.stat()
        stamp = (found.st_mtime_ns, found.st_size)
    except OSError:
        return hashlib.sha256(managed_bytes(path)).hexdigest()
    return HASHES.get(str(path), stamp, lambda: hashlib.sha256(managed_bytes(path)).hexdigest())


def remembered_unchanged(project: Path, root: Path, path: Path) -> bool:
    target = root / MANAGED
    remembered = json.loads(target.read_text()) if target.is_file() else {}
    return remembered.get(path.relative_to(project).as_posix()) == managed_hash(path)


def remember_rewritten(project: Path, root: Path, path: Path) -> None:
    """Records a file the journal wrote again since its install, so the next upgrade knows the change for its own; before the first install records anything there is nothing to add to."""
    target = root / MANAGED
    if not target.is_file():
        return
    remembered = json.loads(target.read_text())
    remembered[path.relative_to(project).as_posix()] = managed_hash(path)
    target.write_text(json.dumps(remembered, indent=2, sort_keys=True) + "\n")
