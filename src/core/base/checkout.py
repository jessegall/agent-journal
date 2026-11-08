from dataclasses import dataclass
from pathlib import Path

from core.base.checkout_type import CheckoutType


@dataclass(frozen=True)
class Checkout:
    """The folder an agent works in: the project itself or a separate copy of it, with the real path of both,
    and the branches a copy was cut from. Both paths are resolved here, so any path it gives can be compared
    with another."""

    checkout_type: CheckoutType
    root: Path
    project_root: Path
    branch: str = ""
    base_branch: str = ""
    base_commit: str = ""
    exists: bool = True

    @classmethod
    def project_checkout(cls, folder: Path, branch: str) -> "Checkout":
        real = folder.resolve()
        return cls(CheckoutType.MAIN, real, real, branch)

    @classmethod
    def copy_checkout(cls, folder: Path, project_folder: Path, branch: str, base_branch: str, base_commit: str, exists: bool) -> "Checkout":
        return cls(CheckoutType.WORKTREE, folder.resolve(), project_folder.resolve(), branch, base_branch, base_commit, exists)

    def variables(self) -> dict[str, str]:
        return {"JOURNAL_CHECKOUT_KIND": self.checkout_type.value, "JOURNAL_CHECKOUT_ROOT": str(self.root), "JOURNAL_PROJECT_ROOT": str(self.project_root),
                "JOURNAL_BRANCH": self.branch, "JOURNAL_BASE_BRANCH": self.base_branch, "JOURNAL_BASE_COMMIT": self.base_commit}

    def values(self) -> dict[str, object]:
        return {"kind": self.checkout_type.value, "root": str(self.root), "project_root": str(self.project_root), "branch": self.branch, "base_branch": self.base_branch,
                "base_commit": self.base_commit, "exists": self.exists}
