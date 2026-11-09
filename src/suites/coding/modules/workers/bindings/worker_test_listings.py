from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKER_TEST_LIMIT
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from suites.coding.modules.workers.commands.restore_worker_tests.restore_worker_tests import RestoreWorkerTests
from core.modules.drivers.support.nudger import Nudger
from suites.coding.modules.workers.support.test_limit_nudges import TEST_COUNT_UNKNOWN, WORKER_TEST_LIMIT_SOURCE
from suites.coding.modules.workers.support.test_listing import TestListing


class WorkerTestListings(RunCounts):
    """Builds per-part listings and adds their counts for a queued worker run."""

    def __init__(self, queries: Queries, settings: SettingValues, run: ReaderRun, folder: OutputFolder, outputs: OutputQuery, readers: ReaderRows, visibility: RunVisibility, rows: EventRows, bus: Bus, nudger: Nudger) -> None:
        self.queries, self.settings, self.run, self.folder, self.outputs, self.readers, self.visibility, self.rows = queries, settings, run, folder, outputs, readers, visibility, rows
        self.bus, self.nudger = bus, nudger

    def parts(self, process: Process) -> tuple[TestListing, ...]:
        return self.agent_parts(process, self.rows.required(Agent, process.session_agent_id))

    def agent_parts(self, process: Process, agent: Agent) -> tuple[TestListing, ...]:
        if not process.is_queue_run or process.creator_id != process.session_agent_id:
            return ()
        if self.settings.number(WORKER_TEST_LIMIT) <= 0:
            return ()
        if agent.role != CodingHelperRole.WORKER:
            return ()
        readers = self.readers.all()
        output = self.outputs.process_output(process.id)
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

    def has_listing(self, process: Process, agent: Agent) -> bool:
        return bool(self.agent_parts(process, agent))

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
        if not self.requires_count(process, agent) or (status is None and not self.has_listing(process, agent)):
            return
        self.nudger.send(process.session_agent_id, TEST_COUNT_UNKNOWN, WORKER_TEST_LIMIT_SOURCE, context, output=process.id)
        self.bus.dispatch(RestoreWorkerTests(process.id), context)
        self.bus.dispatch(StopProcess(process.id), context)

    def counting_reader(self, part: ProcessPart, output: Output | None, readers: tuple[Reader, ...]) -> Reader | None:
        first_answer = self.reader(part, output, readers)
        if first_answer is not None and first_answer.count_command:
            return first_answer
        return next((reader for reader in readers if reader.count_command and ReaderSelection.reads(reader, part)), None)

    def reader(self, part: ProcessPart, output: Output | None, readers: tuple[Reader, ...]) -> Reader | None:
        first_answer = ReaderSelection.choose(readers, [part])
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
