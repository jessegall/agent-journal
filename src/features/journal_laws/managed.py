import hashlib
import json
import re
from pathlib import Path

from engine import runtime
from engine.memo import Memo
from engine.package import SRC
from providers.base import journal_hook

MANAGED = "managed-files.json"
LEGACY_COPY_MARKER = "managed-update-copy"
CURRENT = re.compile(r"<!-- BEGIN: agent-journal, form (\d+) [^\n]*-->.*?<!-- END: agent-journal, form \1 -->", re.DOTALL)


def plain_file(path: Path) -> bool:
    return path.is_file() and not path.is_symlink()


def is_bytecode(path: Path) -> bool:
    """Python writes bytecode beside the code at any moment, so it is no file the journal manages."""
    return "__pycache__" in path.parts


def managed_paths(project: Path, root: Path) -> set[Path]:
    paths = {path for path in (root / SRC).rglob("*") if plain_file(path) and not is_bytecode(path)}
    for home in (".agents/skills", ".claude/skills"):
        folder = project / home
        paths.update(path for skill in folder.glob("journal*") if skill.is_dir() and not skill.is_symlink()
                     for path in skill.rglob("*") if plain_file(path))
    for home, extension in ((".claude/agents", "md"), (".codex/agents", "toml")):
        paths.update(path for path in (project / home).glob(f"*.{extension}") if path.is_file() and path.stem in
                     {"board-filler", "ticket-reviewer", "plan-reviewer", "goal-verifier"})
    for home in (".claude/settings.local.json", ".codex/hooks.json"):
        path = project / home
        if path.is_file():
            paths.add(path)
    paths.update(project / name for name in ("CLAUDE.md", "AGENTS.md") if (project / name).is_file())
    return paths


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


def remember_managed(project: Path, root: Path) -> None:
    files = {path.relative_to(project).as_posix(): managed_hash(path) for path in managed_paths(project, root)}
    target = root / MANAGED
    target.write_text(json.dumps(files, indent=2, sort_keys=True) + "\n")


def remembered_unchanged(project: Path, root: Path, path: Path) -> bool:
    target = root / MANAGED
    remembered = json.loads(target.read_text()) if target.is_file() else {}
    return remembered.get(path.relative_to(project).as_posix()) == managed_hash(path)


def remember_rewritten(project: Path, root: Path, path: Path) -> None:
    target = root / MANAGED
    remembered = json.loads(target.read_text())
    remembered[path.relative_to(project).as_posix()] = managed_hash(path)
    target.write_text(json.dumps(remembered, indent=2, sort_keys=True) + "\n")


def changed_managed(project: Path, root: Path) -> list[Path]:
    target = root / MANAGED
    if not target.is_file() or runtime.upgrading(root):
        return []
    remembered = json.loads(target.read_text())
    changed = {project / name for name, digest in remembered.items()
               if not is_bytecode(Path(name)) and not own_code(root, project / name) and (not (project / name).is_file() or managed_hash(project / name) != digest)}
    changed.update(path for path in managed_paths(project, root)
                   if path.relative_to(project).as_posix() not in remembered and not own_code(root, path) and managed_bytes(path))
    return sorted(changed)


def own_code(root: Path, path: Path) -> bool:
    """A file of the journal's own code folder: an upgrade replaces it whole, so a difference there is no edit of the user's to hold the upgrade for."""
    return (root / SRC) in path.parents


def changed_message(project: Path, changed: list[Path]) -> str:
    names = ", ".join(path.relative_to(project).as_posix() for path in changed)
    return f"Files changed since the journal wrote them: {names}. Run journal upgrade --yes to copy them into .journal/attic and update anyway."
