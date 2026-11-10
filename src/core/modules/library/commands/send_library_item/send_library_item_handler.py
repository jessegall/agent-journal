from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.library.commands.save_library_copy.save_library_copy import SaveLibraryCopy
from core.modules.library.commands.send_library_item.send_library_item import SendLibraryItem
from core.modules.library.support.kept_row import KeptRow
from core.modules.library.support.library_person import LibraryPerson
from core.modules.library.support.library_writes import LibraryWrites
from core.modules.library.support.outgoing_items import OutgoingItems
from core.modules.library.support.shared_library_item import SharedLibraryItem


class SendLibraryItemHandler(Handler[SendLibraryItem, SharedLibraryItem]):
    """Checks a row, uploads it with no write lock held, then writes the copy in a short transaction; only a person
    shares."""

    command = SendLibraryItem

    def __init__(self, outgoing: OutgoingItems, writes: LibraryWrites, bus: Bus) -> None:
        self.outgoing, self.writes, self.bus = outgoing, writes, bus

    def handle(self, command: SendLibraryItem, context: Context) -> SharedLibraryItem:
        LibraryPerson.require(context, "an agent cannot share with the team")
        outgoing = self.outgoing.checked(command.share, command.row_id)
        item = self.writes.new_item(command.share, outgoing.fields)
        copy = self.bus.run(SaveLibraryCopy(command.share, item.item_id, item.version, KeptRow(command.row_id, outgoing.digest)), context.actor)
        return SharedLibraryItem(copy, item, outgoing.warning)
