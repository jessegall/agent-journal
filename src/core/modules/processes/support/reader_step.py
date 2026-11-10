from dataclasses import replace

from core.base.module.performance_tools import PerformanceTools
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from engine.listener.event_rows import EventRows
from core.modules.processes.support.colour_codes import ColourCodes
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.output_page import NEWLINE
from core.modules.processes.support.reader_advance import ReaderAdvance
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.step_tally import StepTally


class ReaderStep:
    """Reads new complete lines for counts and progress, and runs a reader's script when the output ends."""

    def __init__(self, folder: OutputFolder, rows: EventRows, run: ReaderRun, tools: PerformanceTools) -> None:
        self.folder, self.rows, self.run, self.tools = folder, rows, run, tools

    def advance(self, process: Process, output: Output, is_final: bool) -> ReaderAdvance | None:
        if output.reader_id is None:
            return None
        reader = self.rows.required(Reader, output.reader_id)
        started = self.tools.begin()
        advanced = self.script_advance(process, output, reader, is_final) if reader.type is ReaderType.SCRIPT else self.text_advance(process, output, reader, is_final)
        cost = self.tools.cost(started)
        if cost is not None:
            self.tools.run(ReaderTimeTool, reader.name, cost.total)
        return advanced

    def text_advance(self, process: Process, output: Output, reader: Reader, is_final: bool) -> ReaderAdvance | None:
        offset = self.folder.reader_offset(process.id, output.reader_position, output.read_offset)
        cut_bytes = self.folder.cut_bytes(process.id, output.reader_position)
        raw = self.folder.reader_bytes_after(process.id, output.reader_position, offset)
        ready_bytes = raw if is_final else raw[: raw.rfind(NEWLINE) + 1]
        received_offset = offset + cut_bytes + len(raw)
        listing_status = self.folder.progress_count_status(process.id)
        listing_ready = listing_status is not None and not self.folder.progress_count_read(process.id)
        if (not raw or (not ready_bytes and received_offset == output.displayed_offset)) and not listing_ready:
            return None
        text = ColourCodes.removed(ready_bytes.decode(errors="replace"))
        unfinished = ColourCodes.removed(raw[len(ready_bytes):].decode(errors="replace"))
        counted = text.count("\n") + (1 if text and not text.endswith("\n") else 0)
        steps = StepTally.counted(reader.step_pattern, reader.progress_pattern, text)
        restarted = offset + cut_bytes != output.read_offset
        passed = steps.passed if restarted else output.steps_passed + steps.passed
        failed = steps.failed if restarted else output.steps_failed + steps.failed
        test_count = self.run.count(reader, text, output.test_count)
        if not test_count and listing_ready and listing_status == 0:
            test_count = self.run.count(reader, self.folder.progress_count_text(process.id), 0)
        progress = self.run.progress(reader, text, output.progress)
        if reader.step_pattern and not reader.progress_pattern:
            progress = self.step_progress(reader, unfinished, passed + failed, test_count, progress)
        first_line = 1 if restarted else output.read_lines + 1
        lines = self.run.lines(reader, text, process.state.value, first_line) if reader.type is ReaderType.PATTERN else []
        return ReaderAdvance(lines, offset + cut_bytes + len(ready_bytes), counted if restarted else output.read_lines + counted, received_offset,
                             self.run.summary(reader, text) or output.reader_summary, progress,
                             steps_passed=passed, steps_failed=failed, test_count=test_count, replaces=restarted, progress_count_read=listing_ready)

    def step_progress(self, reader: Reader, unfinished: str, completed_steps: int, test_count: int, current: int) -> int:
        total = self.run.count(reader, unfinished, test_count)
        if not total:
            return current
        partial_steps = StepTally.counted(reader.step_pattern, "", unfinished)
        return min(100, (completed_steps + partial_steps.passed + partial_steps.failed) * 100 // total)

    def script_advance(self, process: Process, output: Output, reader: Reader, is_final: bool) -> ReaderAdvance | None:
        advanced = self.text_advance(process, output, reader, is_final)
        if not is_final:
            return advanced
        text = self.folder.reader_text(process.id, output.reader_position)
        if advanced is None:
            advanced = ReaderAdvance([], output.read_offset, output.read_lines, output.displayed_offset, output.reader_summary, output.progress,
                                     steps_passed=output.steps_passed, steps_failed=output.steps_failed, test_count=output.test_count)
        return replace(advanced, lines=self.run.lines(reader, text, process.state.value), replaces=True)
