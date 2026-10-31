from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.process import Process
from core.modules.processes.queries.watch_query import WatchQuery


class EndedProcessWatchListener(SaveListener):
    """A watch ends with its process: when a run ends, every open watch on it ends too."""

    name = "processes.ended-process-watch"
    event = "process.*"

    def __init__(self, watches: WatchQuery, repository: Repository) -> None:
        self.watches, self.repository = watches, repository

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if not isinstance(process, Process) or change.move is None or change.move.name == "background":
            return
        for watch in tuple(self.watches.process(process.id).filter(state=WatchState.OPEN).all_rows()):
            self.repository.save(watch.end(change.context.timestamp, change.context.actor), change.context)
