from dataclasses import dataclass
from functools import cache
from pathlib import Path

from engine.proc import git

MAIN = "the main checkout"
DETACHED = "a detached head"
BRANCH_REF = "ref: refs/heads/"


@dataclass(frozen=True)
class Checkout:
    top: Path
    folder: Path
    linked: bool

    @property
    def name(self) -> str:
        return f"worktree {self.top.name}" if self.linked else MAIN

    @property
    def head_log(self) -> Path:
        return self.folder / "logs" / "HEAD"

    @property
    def branch(self) -> str:
        try:
            text = (self.folder / "HEAD").read_text().strip()
        except OSError:
            return ""
        return text.removeprefix(BRANCH_REF) if text.startswith(BRANCH_REF) else DETACHED


def checkout_of(folder: Path) -> Checkout | None:
    for top in (folder, *folder.parents):
        marker = top / ".git"
        if marker.is_dir():
            return Checkout(top, marker, False)
        if marker.is_file():
            return Checkout(top, Path(marker.read_text().removeprefix("gitdir:").strip()), True)
    return None


@cache
def git_user_name(project: Path) -> str:
    return git(["config", "user.name"], project, timeout=2).strip()
