from dataclasses import dataclass
from pathlib import Path

MAIN = "the main checkout"
DETACHED = "a detached head"
BRANCH_REF = "ref: refs/heads/"
REMOTE_DEFAULT = "refs/remotes/origin/HEAD"


def checkout_name(top: Path, linked: bool, project: Path) -> str:
    """What the chat calls a checkout: a linked worktree by its folder, a repository nested in the project by its path there, and the project's own as the main checkout."""
    if linked:
        return f"worktree {top.name}"
    if project.resolve() in top.resolve().parents:
        return f"repository {top.resolve().relative_to(project.resolve())}"
    return MAIN


@dataclass(frozen=True)
class Checkout:
    top: Path
    folder: Path
    linked: bool

    @property
    def name(self) -> str:
        return checkout_name(self.top, self.linked, self.top)

    def named_in(self, project: Path) -> str:
        return checkout_name(self.top, self.linked, project)

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
