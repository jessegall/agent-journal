from dataclasses import dataclass
from pathlib import Path

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
