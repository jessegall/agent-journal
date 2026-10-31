from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.commands.end_process import EndProcess
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings


class EndProcessHandler(Handler[EndProcess, Process]):
    """Ends the process and keeps an output for it, except for a short run whose line pipes nothing."""

    command = EndProcess

    def __init__(self, queries: Queries, repository: Repository, settings: ProcessSettings, folder: OutputFolder) -> None:
        self.queries, self.repository, self.settings, self.folder = queries, repository, settings, folder

    def handle(self, command: EndProcess, context: Context) -> Process:
        process = self.queries.query(Process).find(command.row_id)
        ended = process.finish(context.timestamp, context.actor, command.exit_code) if command.exit_code == 0 else process.fail(context.timestamp, context.actor, command.exit_code)
        ended = self.repository.save(ended, context)
        if not self.is_short(process, command):
            self.repository.save(Output(process_id=process.id, creator_id=context.actor.id, folder=self.folder.relative(process.id), byte_count=command.byte_count,
                                        line_count=command.line_count), context)
        return ended

    def is_short(self, process: Process, command: EndProcess) -> bool:
        is_piped = self.queries.query(ProcessPart).filter(process_id=process.id, piped=True).exists()
        return command.byte_count < self.settings.short_output_bytes(process.environment_id) and not is_piped
