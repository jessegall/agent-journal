from engine.actor.actor import Actor
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
from core.modules.processes.commands.request_count_reader.request_count_reader import RequestCountReader
from suites.coding.modules.workers.support.worker_test_limit_nudges import TEST_COUNT_UNKNOWN, WORKER_TEST_LIMIT_SOURCE
from suites.coding.modules.workers.support.part_test_listing import PartTestListing

LISTINGS_REASON = "the count of a test command comes from the newest kept output of it that holds one"


class WorkerTestListings(RunCounts):
    """Builds per-part listings and adds their counts for a queued worker run."""

    def __init__(self, queries: Queries, settings: SettingValues, run: ReaderRun, folder: OutputFolder, outputs: OutputQuery, readers: ReaderRows, visibility: RunVisibility, rows: EventRows, bus: Bus, nudger: Nudger) -> None:
        self.queries, self.settings, self.run, self.folder, self.outputs, self.readers, self.visibility, self.rows = queries, settings, run, folder, outputs, readers, visibility, rows
        self.bus, self.nudger = bus, nudger

    def parts(self, process: Process) -> tuple[PartTestListing, ...]:
        agent = self.rows.required(Agent, process.session_agent_id)
        return self.output_parts(process, self.outputs.process_output(process.id)) if self.is_counted(process, agent) else ()

    def is_counted(self, process: Process, agent: Agent) -> bool:
        return process.is_queue_run and process.creator_id == process.session_agent_id and self.settings.number(WORKER_TEST_LIMIT) > 0 and agent.role == CodingHelperRole.WORKER

    def output_parts(self, process: Process, output: Output | None) -> tuple[PartTestListing, ...]:
        readers = self.readers.all()
        listings: list[PartTestListing] = []
        for part in self.visibility.parts(process.id):
            if part.category is not CommandCategory.TEST_RUN:
                continue
            reader = self.counting_reader(part, output, readers)
            if reader is not None:
                listings.append(PartTestListing(part.position, reader, part.command or part.text))
        return tuple(listings)

    def count_missing(self, process: Process, part: ProcessPart) -> bool:
        if part.category is not CommandCategory.TEST_RUN or self.settings.number(WORKER_TEST_LIMIT) <= 0:
            return False
        if self.rows.required(Agent, process.session_agent_id).role != CodingHelperRole.WORKER:
            return False
        return self.counting_reader(part, None, self.readers.all()) is None

    def asks_beyond_counts(self) -> bool:
        return False

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
        self.bus.dispatch(StopProcess(process.id), context)
        request = self.bus.run(RequestCountReader(process.id), Actor.core(), environment_id=process.environment_id)
        self.nudger.send(process.session_agent_id, TEST_COUNT_UNKNOWN, WORKER_TEST_LIMIT_SOURCE, context, output=process.id, name=request)

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
        outputs = sorted(self.outputs.kept().matching_part(command).every_row(LISTINGS_REASON), key=lambda output: output.id, reverse=True)
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
        parts = self.queries.query(ProcessPart).filter(process_id=process.id, text=command).get()
        if any(output.reader_position in (0, part.position) for part in parts):
            return output.test_count
        return None
