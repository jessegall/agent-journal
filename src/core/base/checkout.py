from dataclasses import dataclass
from pathlib import Path

from core.base.checkout_kind import CheckoutKind


@dataclass(frozen=True)
class Checkout:
    """The folder an agent works in: the project itself or a separate copy of it, with the real path of both, and the
    branches a copy was cut from. Both paths are resolved here, so any path it gives can be compared with another."""

    kind: CheckoutKind
    root: Path
    project_root: Path
    branch: str = ""
    base_branch: str = ""
    base_commit: str = ""
    exists: bool = True

    @classmethod
    def of_project(cls, folder: Path, branch: str) -> "Checkout":
        real = folder.resolve()
        return cls(CheckoutKind.MAIN, real, real, branch)

    @classmethod
    def of_copy(cls, folder: Path, project_folder: Path, branch: str, base_branch: str, base_commit: str, exists: bool) -> "Checkout":
        return cls(CheckoutKind.WORKTREE, folder.resolve(), project_folder.resolve(), branch, base_branch, base_commit, exists)
