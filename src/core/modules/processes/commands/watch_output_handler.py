from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.watch_output import WatchOutput
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_access import OutputAccess


class WatchOutputHandler(Handler[WatchOutput, Watch]):
    """Opens a watch for the caller on a run that is still going."""

    command = WatchOutput

    def __init__(self, access: OutputAccess, processes: ProcessQuery, repository: Repository) -> None:
        self.access, self.processes, self.repository = access, processes, repository

    def handle(self, command: WatchOutput, context: Context) -> Watch:
        process = self.access.process(context.actor, command.process_id)
        if not self.processes.running().filter(id=process.id).exists():
            raise Refusal(f"output {process.id} has ended, so there is nothing to watch", f"journal output read {process.id} --summary")
        return self.repository.save(Watch(agent_id=context.actor.id, process_id=process.id, creator_id=context.actor.id), context)
