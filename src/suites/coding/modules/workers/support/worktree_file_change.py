from dataclasses import dataclass, replace

from core.base.checkout import Checkout
from core.base.checkout_file import CheckoutFile
from core.base.file_status import FileStatus

BASE_STATUSES = (FileStatus.CHANGED, FileStatus.DELETED)


@dataclass(frozen=True)
class WorktreeFileChange:
    """One name that differs from a base commit: its name now, what happened to it, and its old name if it was
    renamed."""

    relative: str
    status: FileStatus
    old_name: str = ""

    def deleted_under(self, folder: str) -> bool:
        return self.status is FileStatus.DELETED and folder in self.relative

    def checkout_file(self, checkout: Checkout) -> CheckoutFile:
        return replace(CheckoutFile.located(checkout, self.relative), status=self.status, old_name=self.old_name, base_contains=self.status in BASE_STATUSES)
