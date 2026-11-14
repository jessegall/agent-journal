from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.library.commands.restore_library_item.restore_library_item import RestoreLibraryItem
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.library_writes import LibraryWrites
from core.modules.library.support.restored_library_item import RestoredLibraryItem
from core.modules.library.support.version_request import VersionRequest


class RestoreLibraryItemHandler(Handler[RestoreLibraryItem, RestoredLibraryItem]):
    """Asks the server to bring an item back or to take an old version as a new one, with no write lock held; only a
    person restores, and the server asks for edit rights, or admin rights for a removed item."""

    command = RestoreLibraryItem

    def __init__(self, writes: LibraryWrites) -> None:
        self.writes = writes

    def handle(self, command: RestoreLibraryItem, context: Context) -> RestoredLibraryItem:
        LibraryPerson.require(context, "an agent cannot restore an item of the library")
        if command.version is None:
            return RestoredLibraryItem(self.writes.restore_removed(command.share, command.item_id), None)
        return RestoredLibraryItem(self.writes.restore_version(VersionRequest(command.share, command.item_id, command.version)), command.version)
