from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.confirm_output.confirm_output import ConfirmOutput
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.watch_query import WatchQuery
from core.modules.processes.support.output_access import OutputAccess


class ConfirmOutputHandler(Handler[ConfirmOutput, Watch]):
    """Counts the caller's confirm of a run it waits on once for each wake, so a confirm said twice moves nothing."""

    command = ConfirmOutput

    def __init__(self, access: OutputAccess, watches: WatchQuery, repository: Repository) -> None:
        self.access, self.watches, self.repository = access, watches, repository

    def handle(self, command: ConfirmOutput, context: Context) -> Watch:
        process = self.access.process(context.actor, command.process_id)
        watch = self.watches.open(context.actor.id).filter(process_id=process.id).first()
        if watch is None:
            raise Refusal(f"you are not waiting on output {process.id}", f"journal output read {process.id} --summary")
        if not watch.awaits_confirm:
            return watch
        return self.repository.update(watch, context, confirmed_count=watch.confirmed_count + 1, awaits_confirm=False)
