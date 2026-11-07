from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.library.commands.remove_library_item.remove_library_item import RemoveLibraryItem
from core.base.library.library_item import LibraryItem
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.library_writes import LibraryWrites


class RemoveLibraryItemHandler(Handler[RemoveLibraryItem, LibraryItem]):
    """Asks the server to mark an item removed, with no write lock held; only a person removes, and the server asks
    for an admin."""

    command = RemoveLibraryItem

    def __init__(self, writes: LibraryWrites) -> None:
        self.writes = writes

    def handle(self, command: RemoveLibraryItem, context: Context) -> LibraryItem:
        LibraryPerson.require(context, "an agent cannot remove an item from the library", "ask the user to remove it")
        return self.writes.remove(command.share, command.item_id)
