from core.modules.processes.events.process_ended import ProcessEnded
from engine.listener.save_listener import SaveListener
from engine.repository.repository import Repository
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.queries.watch_query import WatchQuery
from engine.command.context import Context


class EndedProcessWatchListener(SaveListener[ProcessEnded]):
    """A watch ends with its process: when a run ends, every open watch on it ends too."""

    name = "processes.ended-process-watch"

    def __init__(self, watches: WatchQuery, repository: Repository) -> None:
        self.watches, self.repository = watches, repository

    def handle(self, event: ProcessEnded, context: Context) -> None:
        process = event.row
        for watch in tuple(self.watches.process(process.id).filter(state=WatchState.OPEN).all_rows()):
            self.repository.save(watch.end(context.timestamp, context.actor), context)
