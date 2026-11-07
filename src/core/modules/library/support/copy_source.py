from typing import TYPE_CHECKING

from core.base.command.context import Context
from core.base.library.library_share import LibraryShare
from core.base.model.model import Model

if TYPE_CHECKING:
    from core.modules.library.support.kept_row import KeptRow


class CopySource:
    """Where the local row of a new copy comes from: a row that is already here, or one made from an item just
    fetched."""

    def kept(self, share: LibraryShare[Model], context: Context) -> "KeptRow":
        raise NotImplementedError
