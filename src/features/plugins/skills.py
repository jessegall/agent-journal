import shutil
from pathlib import Path

from engine.worktree import ignore
from features.plugins.paths import folder
from providers.base import LIBRARY
from providers.skill_homes import LINKED, link, unlink

MARK = "plugin"
SKILL = "SKILL.md"


def stamped(text: str, plugin: str) -> str:
    line = f"{MARK}: {plugin}\n"
    if not text.startswith("---\n"):
        return f"---\n{line}---\n{text}"
    head, _, rest = text[4:].partition("---\n")
    kept = "".join(l for l in head.splitlines(keepends=True) if not l.startswith(f"{MARK}:"))
    return f"---\n{kept}{line}---\n{rest}"


def owner(skill: Path) -> str:
    try:
        text = (skill / SKILL).read_text()
    except OSError:
        return ""
    head = text[4:].partition("---\n")[0] if text.startswith("---\n") else ""
    return next((l.split(":", 1)[1].strip() for l in head.splitlines() if l.startswith(f"{MARK}:")), "")


def owned(project: Path, plugin: str) -> list[str]:
    home = project / LIBRARY
    return sorted(p.name for p in home.iterdir() if p.is_dir() and owner(p) == plugin) if home.is_dir() else []


def shipped(root: Path, plugin: str, manifest) -> dict[str, Path]:
    source = folder(root, plugin) / manifest.skills
    if not manifest.skills or not source.is_dir():
        return {}
    return {p.name: p for p in sorted(source.iterdir()) if (p / SKILL).is_file()}


def ignored(project: Path, names: list[str]) -> None:
    exclude = project / ".git" / "info" / "exclude"
    if exclude.parent.is_dir():
        ignore(exclude, [f"/{home}/{name}" for name in names for home in (LIBRARY, *LINKED.values())])


def published(root: Path, plugin: str, manifest) -> list[str]:
    project = Path(root).parent
    theirs = shipped(root, plugin, manifest)
    placed = []
    for name, source in theirs.items():
        target = project / LIBRARY / name
        if target.exists() and owner(target) != plugin:
            continue
        shutil.rmtree(target, ignore_errors=True)
        shutil.copytree(source, target)
        (target / SKILL).write_text(stamped((target / SKILL).read_text(), plugin))
        placed.append(name)
    link(project, placed)
    for stale in set(owned(project, plugin)) - set(theirs):
        unlink(project, stale)
    ignored(project, placed)
    return placed


def withdrawn(root: Path, plugin: str) -> list[str]:
    project = Path(root).parent
    gone = owned(project, plugin)
    for name in gone:
        unlink(project, name)
    return gone
