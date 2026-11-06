from collections.abc import Mapping
from dataclasses import asdict, dataclass, replace
from pathlib import Path

from core.base.checkout import Checkout
from core.base.file_state import FileState
from core.base.file_status import FileStatus


@dataclass(frozen=True)
class CheckoutFile:
    """One file by its name in a checkout: relative runs from the root of the checkout with /, and is the same for that
    file in the project and in every copy; path is its real place, and project_path where the same name lies in the
    project. linked says the name lies under a link in the checkout, so path is outside the root."""

    relative: str
    path: str
    project_path: str
    linked: bool
    status: FileStatus = FileStatus.CHANGED
    renamed_from: str = ""
    in_base: bool = False

    @classmethod
    def named(cls, checkout: Checkout, name: str | Path) -> "CheckoutFile":
        """Only the folder of the file is resolved, so a deleted file still has a name. The test is against the root of
        this checkout and never a prefix of the project, since a copy may lie inside the project folder."""
        written = checkout.root / name
        real = written.parent.resolve() / written.name
        linked = not real.is_relative_to(checkout.root)
        relative = cls.under_a_link(checkout, written) if linked else real.relative_to(checkout.root)
        return cls(relative.as_posix(), str(real), str(checkout.project_root / relative), linked)

    @staticmethod
    def under_a_link(checkout: Checkout, written: Path) -> Path:
        """The name as written from the root of the checkout, or its place outside the checkout when it never passes there."""
        for folder in written.parents:
            if folder.resolve() == checkout.root:
                return written.relative_to(folder)
        return written

    @classmethod
    def restored(cls, values: Mapping[str, object]) -> "CheckoutFile":
        return cls(str(values["relative"]), str(values["path"]), str(values["project_path"]), bool(values["linked"]), FileStatus(str(values["status"])), str(values["renamed_from"]), bool(values["in_base"]))

    def with_state(self, state: FileState) -> "CheckoutFile":
        return replace(self, status=state.status, in_base=state.in_base)

    def values(self) -> dict[str, object]:
        return asdict(self)
