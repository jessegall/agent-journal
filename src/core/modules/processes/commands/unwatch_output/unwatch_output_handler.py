from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.unwatch_output.unwatch_output import UnwatchOutput
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.watch_query import WatchQuery


class UnwatchOutputHandler(Handler[UnwatchOutput, Watch]):
    """Ends the open watch the caller has on the run."""

    command = UnwatchOutput

    def __init__(self, watches: WatchQuery, repository: Repository) -> None:
        self.watches, self.repository = watches, repository

    def handle(self, command: UnwatchOutput, context: Context) -> Watch:
        open_watch = self.watches.open(context.actor.id).process(command.process_id).first()
        if open_watch is None:
            raise Refusal(f"you have no open watch on output {command.process_id}", "journal watch list shows your watches")
        return self.repository.save(open_watch.end(context.timestamp, context.actor), context)
