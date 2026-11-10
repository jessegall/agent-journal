from dataclasses import dataclass

from engine.command.context import Context
from core.base.library.library_share import LibraryShare
from engine.model.model import Model
from core.modules.library.support.copy_source import CopySource


@dataclass(frozen=True)
class KeptRow(CopySource):
    """A local row that is already here, with the digest of the fields that were sent to the server for it."""

    row_id: int
    digest: str

    def kept(self, share: LibraryShare[Model], context: Context) -> "KeptRow":
        return self
