from core.base.actor import Actor
from core.base.change.event_log import FILE_PUBLISHING_EVENTS
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.processes.commands.update_stock_readers.update_stock_readers import UpdateStockReaders
from core.base.change.file_publishing import FilePublishing


class StockReadersPublishListener(CommitListener[FilePublishing]):
    name = "processes.publish-stock-readers"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.bus.run(UpdateStockReaders(), Actor.core(), cause_id=logged.id)
