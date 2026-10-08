import os
import shutil
from pathlib import Path

from engine.worktree import untracked
from providers import PROVIDERS
from providers.base import LIBRARY


def skill_name(name: str) -> str:
    return f"journal-{name.removeprefix('journal_').replace('_', '-')}"


LINKED = {name: cls.skill_home for name, cls in PROVIDERS.items() if cls.link_skills}
RETIRED = tuple(dict.fromkeys(home for cls in PROVIDERS.values() for home in cls.retired_skill_homes))


def library(project: Path, folder: Path) -> bool:
    return folder.resolve() == (project / LIBRARY).resolve()


def link(project: Path, names: list[str], agents: tuple[str, ...] = tuple(LINKED)) -> list[Path]:
    targets = {(name, agent): project / LINKED[agent] / name for name in names for agent in agents if not library(project, project / LINKED[agent])}
    untracked_targets = set(untracked(project, [target.relative_to(project) for target in targets.values()]))
    links = []
    for (name, agent), target in targets.items():
        source = project / LIBRARY / name
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.relative_to(project) not in untracked_targets:
            if target.is_symlink():
                target.unlink()
            shutil.copytree(source, target, dirs_exist_ok=True)
            continue
        if target.is_symlink() or target.is_file():
            target.unlink()
        elif target.is_dir():
            shutil.rmtree(target)
        target.symlink_to(os.path.relpath(source, target.parent))
        links.append(target)
    return links


def unlink(project: Path, name: str) -> None:
    for home in (LIBRARY, *LINKED.values()):
        target = project / home / name
        if target.is_symlink():
            target.unlink()
        elif target.is_dir():
            shutil.rmtree(target)


def pruned(project: Path, names: list[str]) -> list[Path]:
    gone = []
    for home in (LIBRARY, *LINKED.values()):
        for stale in sorted((project / home).glob("journal*")):
            if stale.name in names or not (stale.is_symlink() or stale.is_dir()):
                continue
            unlink(project, stale.name)
            gone.append(stale)
    return gone
