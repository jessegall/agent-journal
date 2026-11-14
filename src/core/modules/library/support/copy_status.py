import json
from collections.abc import Mapping
from dataclasses import asdict, dataclass

from core.modules.library.models.enums.copy_progress import CopyProgress
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.copy_status_view import CopyStatusView


@dataclass(frozen=True)
class CopyStatus:
    """What a user sees of one copy: the item it follows, where it stands, the note that says why, the text
    here and the library's text last seen, so the two can be compared offline."""

    copy: LibraryCopy
    progress: CopyProgress
    local_fields: Mapping[str, object]

    def lines(self) -> list[str]:
        head = f"copy {self.copy.id}: {self.copy.share} {self.copy.row_id} follows library {self.copy.share} {self.copy.item_id}, version {self.copy.base_version}. Status: {self.progress.label}"
        return [head, f"    {self.copy.note}"] if self.copy.note else [head]

    def json(self) -> Mapping[str, object]:
        copy = self.copy
        return asdict(CopyStatusView(copy.id, copy.share, copy.row_id, copy.item_id, copy.base_version, self.progress.value, self.progress.label, copy.note, copy.server_version,
                                     dict(self.local_fields), json.loads(copy.server_fields)))
