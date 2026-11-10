from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from core.modules.processes.commands.update_stock_readers.update_stock_readers import UpdateStockReaders
from engine.event.file_publishing import FilePublishing


class StockReadersPublishListener(CommitListener[FilePublishing]):
    name = "processes.publish-stock-readers"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        self.bus.run(UpdateStockReaders(), Actor.core(), cause_id=logged.id)
