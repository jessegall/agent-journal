from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKER_TEST_LIMIT
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.reader_run import ReaderRun
from suites.coding.modules.workers.support.test_listing import TestListing


class WorkerTestListings(RunCounts):
    """Builds per-part listings and adds their counts for a queued worker run."""

    def __init__(self, queries: Queries, settings: SettingValues, run: ReaderRun, folder: OutputFolder, outputs: OutputQuery) -> None:
        self.queries, self.settings, self.run, self.folder, self.outputs = queries, settings, run, folder, outputs

    def parts(self, process: Process) -> tuple[TestListing, ...]:
        if not process.is_queue_run or process.creator_id != process.agent_id:
            return ()
        if self.settings.number(WORKER_TEST_LIMIT, process.environment_id) <= 0:
            return ()
        if self.queries.query(Agent).find(process.agent_id).role != AgentRole.WORKER:
            return ()
        readers = tuple(self.queries.query(Reader).all_rows())
        outputs = self.queries.query(Output).filter(process_id=process.id).page(1, 1).rows
        output = outputs[0] if outputs else None
        listings: list[TestListing] = []
        for part in self.queries.query(ProcessPart).filter(process_id=process.id).oldest().all_rows():
            if part.category is not CommandCategory.TEST_RUN:
                continue
            reader = self.reader(part, output, readers)
            if reader is not None and reader.count_command:
                listings.append(TestListing(part.position, reader, part.command or part.text))
        return tuple(listings)

    def line(self, process: Process) -> str:
        return " && ".join(listing.line for listing in self.parts(process))

    def has_listing(self, process: Process) -> bool:
        return bool(self.parts(process))

    def count(self, process: Process, text: str) -> int:
        counts = [self.run.count(listing.reader, listing.output_text(text), 0) for listing in self.parts(process)]
        return sum(counts) if counts and all(count > 0 for count in counts) else 0

    def reader(self, part: ProcessPart, output: Output | None, readers: tuple[Reader, ...]) -> Reader | None:
        selected = ReaderSelection.choose(readers, [part])
        if output is None or output.reader_id is None:
            return selected.reader if selected else None
        if output.reader_position not in (0, part.position):
            return selected.reader if selected else None
        return self.queries.query(Reader).find(output.reader_id)

    def previous_count(self, environment_id: int, command: str) -> int:
        outputs = self.outputs.kept().matching_part(environment_id, command).newest().all_rows()
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
