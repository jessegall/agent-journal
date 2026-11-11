from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from engine.setting.setting_values import SettingValues
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from engine.driver.nudger import Nudger
from suites.coding.modules.workers.support.test_limit_nudges import TEST_COUNT_UNKNOWN, WORKER_TEST_LIMIT_SOURCE
from suites.coding.modules.workers.support.test_listing import TestListing


class WorkerTestListings(RunCounts):
    """Builds per-part listings and adds their counts for a queued worker run."""

    def __init__(self, queries: Queries, settings: SettingValues, run: ReaderRun, folder: OutputFolder, outputs: OutputQuery, readers: ReaderRows, visibility: RunVisibility, rows: EventRows, bus: Bus, nudger: Nudger) -> None:
        self.queries, self.settings, self.run, self.folder, self.outputs, self.readers, self.visibility, self.rows = queries, settings, run, folder, outputs, readers, visibility, rows
        self.bus, self.nudger = bus, nudger

    def parts(self, process: Process) -> tuple[TestListing, ...]:
        agent = self.rows.required(Agent, process.session_agent_id)
        return self.output_parts(process, self.outputs.process_output(process.id)) if self.is_counted(process, agent) else ()

    def is_counted(self, process: Process, agent: Agent) -> bool:
        return process.is_queue_run and process.creator_id == process.session_agent_id and self.settings.number(WORKER_TEST_LIMIT) > 0 and agent.role == CodingHelperRole.WORKER

    def output_parts(self, process: Process, output: Output | None) -> tuple[TestListing, ...]:
        readers = self.readers.all()
        listings: list[TestListing] = []
        for part in self.visibility.parts(process.id):
            if part.category is not CommandCategory.TEST_RUN:
                continue
            reader = self.counting_reader(part, output, readers)
            if reader is not None:
                listings.append(TestListing(part.position, reader, part.command or part.text))
        return tuple(listings)

    def reader_reason(self, process: Process, spec: PartSpec, reader: Reader | None, reason: str) -> str:
        if spec.category is not CommandCategory.TEST_RUN or self.settings.number(WORKER_TEST_LIMIT) <= 0:
            return ""
        part = ProcessPart(process_id=process.id, position=0, text=spec.text, program=spec.program, command=spec.command, piped=spec.piped, category=spec.category)
        if self.counting_reader(part, None, self.readers.all()) is not None:
            return ""
        return f"no reader counts the tests of {spec.command or spec.text}"

    def line(self, process: Process) -> str:
        return " && ".join(listing.line for listing in self.parts(process))

    def has_listing(self, process: Process, agent: Agent, output: Output | None) -> bool:
        return self.is_counted(process, agent) and bool(self.output_parts(process, output))

    def count(self, process: Process, text: str) -> int:
        counts = [self.run.count(listing.reader, listing.output_text(text), 0) for listing in self.parts(process)]
        return sum(counts) if counts and all(count > 0 for count in counts) else 0

    def requires_count(self, process: Process, agent: Agent) -> bool:
        return (process.is_queue_run and process.creator_id == process.session_agent_id and agent.role == CodingHelperRole.WORKER
                and self.settings.number(WORKER_TEST_LIMIT) > 0
                and any(part.category is CommandCategory.TEST_RUN for part in self.visibility.parts(process.id)))

    def reject_unknown(self, process: Process, agent: Agent, status: int | None, count: int, context: Context) -> None:
        if status == 0 and count > 0:
            return
        if not self.requires_count(process, agent) or (status is None and not self.has_listing(process, agent, self.outputs.process_output(process.id))):
            return
        self.nudger.send(process.session_agent_id, TEST_COUNT_UNKNOWN, WORKER_TEST_LIMIT_SOURCE, context, output=process.id)
        self.bus.dispatch(StopProcess(process.id), context)

    def counting_reader(self, part: ProcessPart, output: Output | None, readers: tuple[Reader, ...]) -> Reader | None:
        first_answer = self.reader(part, output, readers)
        if first_answer is not None and first_answer.count_command:
            return first_answer
        return next((reader for reader in readers if reader.count_command and ReaderSelection.reads(reader, part)), None)

    def reader(self, part: ProcessPart, output: Output | None, readers: tuple[Reader, ...]) -> Reader | None:
        first_answer = ReaderSelection.choose(readers, [part], self.readers.layers())
        if output is None or output.reader_id is None:
            return first_answer.reader if first_answer else None
        if output.reader_position not in (0, part.position):
            return first_answer.reader if first_answer else None
        return self.rows.required(Reader, output.reader_id)

    def previous_count(self, command: str) -> int:
        outputs = self.outputs.kept().matching_part(command).newest().all_rows()
        for output in outputs:
            count = self.recorded_count(output, command)
            if count is not None:
                return count
        return 0

    def recorded_count(self, output: Output, command: str) -> int | None:
        process = self.queries.query(Process).find(output.process_id)
        if self.folder.count_status(process.id) == 0:
            for listing in self.parts(process):
                if listing.command != command:
                    continue
                count = self.run.count(listing.reader, listing.output_text(self.folder.count_text(process.id)), 0)
                if count > 0:
                    return count
        parts = self.queries.query(ProcessPart).filter(process_id=process.id, text=command).all_rows()
        if any(output.reader_position in (0, part.position) for part in parts):
            return output.test_count
        return None
