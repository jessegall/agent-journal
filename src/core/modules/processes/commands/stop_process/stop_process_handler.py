from engine.actor.actor import Actor
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import OUTPUT_STOPPED
from core.modules.processes.support.process_group import ProcessGroup


class StopProcessHandler(Handler[StopProcess, Process]):
    """Ends the process stopped, then kills the group of the runner that ran it, and tells the agent that started it
    that the output is kept. A stop by the journal itself says so in its own line."""

    command = StopProcess

    def __init__(self, queries: Queries, repository: Repository, group: ProcessGroup, folder: OutputFolder, nudger: Nudger) -> None:
        self.queries, self.repository, self.group, self.folder, self.nudger = queries, repository, group, folder, nudger

    def handle(self, command: StopProcess, context: Context) -> Process:
        current = self.queries.query(Process).find(command.row_id)
        process = self.repository.save_change(current, current.stop(context.timestamp, context.actor), context)
        self.group.stop(process.pid or self.folder.pid(process.id), process.id)
        if context.actor != Actor.core():
            self.nudger.send(process.session_agent_id, OUTPUT_STOPPED, "processes.stopped", context, output=process.id)
        return process
