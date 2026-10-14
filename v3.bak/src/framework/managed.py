"""Which files the journal writes into a project, and which of them changed since it last wrote them; built on the core in engine.managed."""

import json
from pathlib import Path

from engine.managed import CURRENT, MANAGED, managed_bytes, managed_hash, remember_rewritten, remembered_unchanged  # noqa: F401  the door features use
from resources.code import SRC
from resources.places import upgrade_mark

LEGACY_COPY_MARKER = "managed-update-copy"


def plain_file(path: Path) -> bool:
    return path.is_file() and not path.is_symlink()


def is_bytecode(path: Path) -> bool:
    """Python writes bytecode beside the code at any moment, so it is no file the journal manages."""
    return "__pycache__" in path.parts


def managed_paths(project: Path, root: Path) -> set[Path]:
    return {path for path in (root / SRC).rglob("*") if plain_file(path) and not is_bytecode(path)} | written_into_the_project(project)


def written_into_the_project(project: Path) -> set[Path]:
    """The files the journal writes into the project beside its own code: its skills, agent types, hook settings and instruction files."""
    paths = set()
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


def remember_managed(project: Path, root: Path) -> None:
    files = {path.relative_to(project).as_posix(): managed_hash(path) for path in managed_paths(project, root)}
    target = root / MANAGED
    target.write_text(json.dumps(files, indent=2, sort_keys=True) + "\n")


def changed_managed(project: Path, root: Path) -> list[Path]:
    target = root / MANAGED
    if not target.is_file() or upgrade_mark(root).is_file():
        return []
    remembered = json.loads(target.read_text())
    # the journal's own code is replaced whole by an upgrade, so a difference there is no edit of the user's to hold it for
    code = f"{root / SRC}/"
    changed = {project / name for name, digest in remembered.items()
               if not f"{project}/{name}".startswith(code) and not is_bytecode(Path(name)) and (not (project / name).is_file() or managed_hash(project / name) != digest)}
    changed.update(path for path in written_into_the_project(project)
                   if path.relative_to(project).as_posix() not in remembered and managed_bytes(path))
    return sorted(changed)


def changed_message(project: Path, changed: list[Path]) -> str:
    names = ", ".join(path.relative_to(project).as_posix() for path in changed)
    return f"Files changed since the journal wrote them: {names}. Run journal upgrade --yes to copy them into .journal/attic and update anyway."
