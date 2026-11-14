from collections.abc import Mapping
from dataclasses import dataclass, replace
from pathlib import Path

from engine.checkout.checkout import Checkout
from engine.checkout.file_state import FileState
from engine.enums.file_status import FileStatus


@dataclass(frozen=True)
class CheckoutFile:
    """One file by its name in a checkout: relative runs from the root of the checkout with /, and is the same
    for that file in the project and in every copy; path is its real place, and project_path where the same
    name lies in the project. linked says the name lies under a link in the checkout, so path is outside the
    root. Only the folder of a file is resolved, so a deleted file still has a name, and it is tested against
    the root of its checkout, never a prefix of the project, since a copy may lie inside the project folder."""

    relative: str
    path: str
    project_path: str
    linked: bool
    status: FileStatus = FileStatus.CHANGED
    old_name: str = ""
    base_contains: bool = False

    @classmethod
    def located(cls, checkout: Checkout, name: str | Path) -> "CheckoutFile":
        file_path = checkout.root / name
        real = file_path.parent.resolve() / file_path.name
        linked = not real.is_relative_to(checkout.root)
        relative = cls.linked_name(checkout, file_path) if linked else real.relative_to(checkout.root)
        return cls(relative.as_posix(), str(real), str(checkout.project_root / relative), linked)

    @staticmethod
    def linked_name(checkout: Checkout, file_path: Path) -> Path:
        for folder in file_path.parents:
            if folder.resolve() == checkout.root:
                return file_path.relative_to(folder)
        return file_path

    @classmethod
    def restored(cls, values: Mapping[str, object]) -> "CheckoutFile":
        return cls(str(values["relative"]), str(values["path"]), str(values["project_path"]), bool(values["linked"]), FileStatus(str(values["status"])), str(values["renamed_from"]), bool(values["in_base"]))

    def with_state(self, state: FileState) -> "CheckoutFile":
        return replace(self, status=state.status, base_contains=state.base_contains)

    def values(self) -> dict[str, object]:
        return {"relative": self.relative, "path": self.path, "project_path": self.project_path, "status": self.status.value, "renamed_from": self.old_name, "in_base": self.base_contains, "linked": self.linked}
