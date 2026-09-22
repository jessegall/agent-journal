import shutil
from pathlib import Path

from features.plugins.source import folder
from skills import LIBRARY, LINKED, link, unlink

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


def shipped(root: Path, plugin: str, manifest: dict) -> dict[str, Path]:
    source = folder(root, plugin) / str(manifest.get("skills") or "")
    if not manifest.get("skills") or not source.is_dir():
        return {}
    return {p.name: p for p in sorted(source.iterdir()) if (p / SKILL).is_file()}


def ignored(project: Path, names: list[str]) -> None:
    exclude = project / ".git" / "info" / "exclude"
    if not exclude.parent.is_dir():
        return
    known = exclude.read_text().splitlines() if exclude.is_file() else []
    wanted = [f"/{home}/{name}" for name in names for home in (LIBRARY, *LINKED.values())]
    missing = [line for line in wanted if line not in known]
    if missing:
        exclude.write_text("\n".join([*known, *missing]) + "\n")


def published(root: Path, plugin: str, manifest: dict) -> list[str]:
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
        link(project, name)
        placed.append(name)
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
