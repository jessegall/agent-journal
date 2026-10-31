from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.stop_process import StopProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_group import ProcessGroup


class StopProcessHandler(Handler[StopProcess, Process]):
    """Ends the process stopped, then kills the group of the runner that ran it."""

    command = StopProcess

    def __init__(self, queries: Queries, repository: Repository, group: ProcessGroup) -> None:
        self.queries, self.repository, self.group = queries, repository, group

    def handle(self, command: StopProcess, context: Context) -> Process:
        process = self.repository.save(self.queries.query(Process).find(command.row_id).stop(context.timestamp, context.actor), context)
        self.group.stop(process.pid)
        return process
