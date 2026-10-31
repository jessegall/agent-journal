from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process import StartProcess
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_selection import ReaderSelection


class StartProcessHandler(Handler[StartProcess, Process]):
    """Saves a running process, its parts, one for each command of the line in order, and the output it will keep with the
    reader chosen for the line."""

    command = StartProcess

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, readers: ReaderQuery) -> None:
        self.queries, self.repository, self.folder, self.readers = queries, repository, folder, readers

    def handle(self, command: StartProcess, context: Context) -> Process:
        agent = self.queries.query(Agent).find(command.agent_id)
        process = self.repository.save(Process(environment_id=agent.environment_id, agent_id=agent.id, hook_call_id=command.hook_call_id, creator_id=context.actor.id,
                                               line=command.line, folder=command.folder, shell=command.shell, category=command.category,
                                               limit_seconds=command.limit_seconds), context)
        for position, part in enumerate(command.parts, 1):
            self.repository.save(ProcessPart(process_id=process.id, position=position, text=part.text, program=part.program, piped=part.piped), context)
        reader = ReaderSelection.choose(tuple(self.readers.all_rows()), process)
        self.repository.save(Output(process_id=process.id, creator_id=context.actor.id, folder=self.folder.relative(process.id), reader_id=reader.id if reader is not None else None), context)
        self.folder.write_start(process.id, command.line, [part.text for part in command.parts])
        return process
