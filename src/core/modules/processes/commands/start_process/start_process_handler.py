from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.output import Output
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.run_title import RunTitle


class StartProcessHandler(Handler[StartProcess, Process]):
    """Saves a running process, its parts, one for each command of the line in order, and the output it
    will keep with the reader the line's alias names, which reads all parts, or else the one chosen for one
    part."""

    command = StartProcess

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, readers: ReaderQuery, kept: KeptRows) -> None:
        self.queries, self.repository, self.folder, self.readers, self.kept = queries, repository, folder, readers, kept

    def handle(self, command: StartProcess, context: Context) -> Process:
        agent = self.queries.query(Agent).find(command.agent_id)
        process = self.repository.save(Process(environment_id=agent.environment_id, agent_id=agent.id, hook_call_id=command.hook_call_id, creator_id=context.actor.id,
                                               line=command.line, folder=command.folder, shell=command.shell, category=command.category,
                                               limit_seconds=command.limit_seconds, is_full_test_run=command.is_full_test_run,
                                               is_queued=command.is_queued, is_queue_run=command.is_queued,
                                               started_at=None if command.is_queued else context.timestamp), context)
        parts = [self.repository.save(ProcessPart(process_id=process.id, position=position, text=part.text, program=part.program, command=part.command, piped=part.piped, category=part.category), context)
                 for position, part in enumerate(command.parts, 1)]
        if command.reader_id is not None:
            reader = self.readers.find(command.reader_id)
            self.repository.save(Output(process_id=process.id, creator_id=context.actor.id, folder=self.folder.relative(process.id), reader_id=reader.id, title=RunTitle.title(reader, command.line)), context)
        else:
            part_reader = ReaderSelection.choose(self.all_readers(), parts)
            self.repository.save(Output(process_id=process.id, creator_id=context.actor.id, folder=self.folder.relative(process.id), reader_id=part_reader.reader.id if part_reader else None,
                                        reader_position=part_reader.part.position if part_reader else 0, title=RunTitle.title(part_reader.reader, part_reader.part.text) if part_reader else ""), context)
        self.folder.write_start(process.id, command.line, [part.text for part in command.parts])
        return process

    def all_readers(self) -> tuple[Reader, ...]:
        return self.kept.read("readers", lambda: tuple(self.readers.all_rows()))
