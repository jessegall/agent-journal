from dataclasses import dataclass
from pathlib import Path

from engine.proc import git

MAIN = "the main checkout"
DETACHED = "a detached head"
BRANCH_REF = "ref: refs/heads/"
REMOTE_DEFAULT = "refs/remotes/origin/HEAD"


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

    @property
    def config(self) -> Path:
        common = self.folder / "commondir"
        return (self.folder / common.read_text().strip() if common.is_file() else self.folder) / "config"

    @property
    def landing(self) -> str:
        try:
            return (self.folder / REMOTE_DEFAULT).read_text().strip().removeprefix("ref: ")
        except OSError:
            return ""

    @property
    def landing_log(self) -> Path:
        return self.folder / "logs" / self.landing


def checkout_of(folder: Path) -> Checkout | None:
    for top in (folder, *folder.parents):
        marker = top / ".git"
        if marker.is_dir():
            return Checkout(top, marker, False)
        if marker.is_file():
            return Checkout(top, Path(marker.read_text().removeprefix("gitdir:").strip()), True)
    return None


def git_user_name(project: Path) -> str:
    return git(["config", "user.name"], project, timeout=2).strip()


def commits_since(project: Path, since: float, most: int = 0, timeout: float = 5) -> list[tuple[str, str]]:
    limit = [f"-n{most}"] if most else []
    out = git(["log", f"--since=@{int(since)}", "--format=%H%x1f%s", *limit], project, timeout=timeout)
    return [(sha, subject) for sha, _, subject in (line.partition("\x1f") for line in out.splitlines()) if sha]


def config_changed_at(project: Path) -> float:
    checkout = checkout_of(project)
    files = [Path.home() / ".gitconfig", *([checkout.config] if checkout else [])]
    return max((f.stat().st_mtime for f in files if f.is_file()), default=0.0)
