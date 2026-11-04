from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.library.models.enums.copy_progress import CopyProgress
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class CopyStatus:
    """What a person sees of one copy: the item it follows, where it stands and the note that says why."""

    copy: LibraryCopy
    progress: CopyProgress

    def lines(self) -> list[str]:
        head = f"copy {self.copy.id}: {self.copy.share} {self.copy.row_id} follows library {self.copy.share} {self.copy.item_id}, version {self.copy.base_version}. Status: {self.progress.label}"
        return [head, f"    {self.copy.note}"] if self.copy.note else [head]

    def json(self) -> Mapping[str, object]:
        return {"copy_id": self.copy.id, "kind": self.copy.share, "row_id": self.copy.row_id, "item_id": self.copy.item_id, "version": self.copy.base_version,
                "status": self.progress.value, "label": self.progress.label, "note": self.copy.note}
