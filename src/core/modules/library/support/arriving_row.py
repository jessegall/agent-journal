from collections.abc import Mapping
from dataclasses import dataclass

from engine.command.context import Context
from core.base.library.library_share import LibraryShare
from engine.model.model import Model
from core.modules.library.support.copy_source import CopySource
from core.modules.library.support.kept_row import KeptRow


@dataclass(frozen=True)
class ArrivingRow(CopySource):
    """The fields of an item just fetched, from which the share makes the local row. The digest is taken from the
    row it made, since making it may change what the row holds compared with the server's fields."""

    fields: Mapping[str, object]

    def kept(self, share: LibraryShare[Model], context: Context) -> KeptRow:
        row = share.arrive(self.fields, context)
        return KeptRow(row.id, share.digest(row))
