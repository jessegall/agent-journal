from core.base.driver.command_category import CommandCategory
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.duration import Duration
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.output import Output
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.run_title import RunTitle
from core.modules.processes.support.reader_requests import ReaderRequests
from core.modules.processes.support.run_slots import RunSlots
from core.modules.processes.support.part_visibility import PartVisibility


class StartProcessHandler(Handler[StartProcess, Process]):
    """Saves a running process, its parts, one for each command of the line in order, and the output it
    will keep with the reader the line's alias names, which reads all parts, or else the one chosen for one
    part."""

    command = StartProcess
    runs_once = True

    def __init__(self, repository: Repository, folder: OutputFolder, readers: ReaderRows, requests: ReaderRequests, slots: RunSlots, visibility: PartVisibility, rows: EventRows) -> None:
        self.repository, self.folder, self.readers = repository, folder, readers
        self.requests = requests
        self.slots = slots
        self.visibility = visibility
        self.rows = rows

    def handle(self, command: StartProcess, context: Context) -> Process:
        timeouts = tuple(Duration.parse(value).seconds for value in command.timeout_durations)
        agent = self.rows.required(Agent, command.agent_id)
        process = self.repository.save(Process(session_agent_id=agent.id, hook_call_id=command.hook_call_id, creator_id=context.actor.id,
                                               line=command.line, folder=command.folder, shell=command.shell, category=command.category,
                                               limit_seconds=command.limit_seconds, is_full_test_run=command.is_full_test_run,
                                               queued_at=context.timestamp, plugin=command.plugin, is_queue_run=bool(command.plugin) or any(part.category.is_queued for part in command.parts) and all(part.category.is_queued or part.category is CommandCategory.JOURNAL for part in command.parts),
                                               owner_agent_id=command.owner_agent_id, task_id=command.task_id, timeout_seconds=min(timeouts, default=None)), context)
        parts: list[ProcessPart] = []
        for position, spec in enumerate(command.parts, 1):
            part = ProcessPart(process_id=process.id, position=position, text=spec.text, program=spec.program, command=spec.command, piped=spec.piped, category=spec.category, is_visible=self.visibility.is_visible(spec))
            selected = ReaderSelection.choose(self.readers.all(), [part])
            explicit_reader_id = spec.named_reader_id if spec.named_reader_id is not None else command.reader_id
            reader = selected.reader if selected else None
            if explicit_reader_id is not None:
                reader = self.rows.required(Reader, explicit_reader_id)
            request_id = self.requests.request(process, spec, reader, context) if self.requests.needed(process, agent) else None
            parts.append(self.repository.save(part.changed(reader_request_id=request_id), context))
        if command.reader_id is not None and not any(part.reader_request_id is not None for part in parts):
            reader = self.rows.required(Reader, command.reader_id)
            self.repository.save(Output(process_id=process.id, creator_id=context.actor.id, folder=self.folder.relative(process.id), reader_id=reader.id, title=RunTitle.title(reader, command.line)), context)
        else:
            part_reader = ReaderSelection.choose(self.readers.all(), [part for part in parts if part.reader_request_id is None])
            self.repository.save(Output(process_id=process.id, creator_id=context.actor.id, folder=self.folder.relative(process.id), reader_id=part_reader.reader.id if part_reader else None,
                                        reader_position=part_reader.part.position if part_reader else 0, title=RunTitle.title(part_reader.reader, part_reader.part.text) if part_reader else ""), context)
        self.folder.write_start(process.id, command.line, [part.text for part in command.parts])
        self.slots.remember(process)
        self.slots.grant(context)
        return self.rows.required(Process, process.id)

