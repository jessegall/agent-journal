from dataclasses import replace

from core.base.module.performance_tools import PerformanceTools
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.colour_codes import ColourCodes
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_advance import ReaderAdvance
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.step_tally import StepTally

NEWLINE = b"\n"


class ReaderStep:
    """Reads new complete lines for counts and progress, and runs a reader's script when the output ends."""

    def __init__(self, folder: OutputFolder, readers: ReaderQuery, run: ReaderRun, tools: PerformanceTools) -> None:
        self.folder, self.readers, self.run, self.tools = folder, readers, run, tools

    def advance(self, process: Process, output: Output, is_final: bool) -> ReaderAdvance | None:
        if output.reader_id is None:
            return None
        reader = self.readers.find(output.reader_id)
        started = self.tools.begin()
        advanced = self.script_advance(process, output, reader, is_final) if reader.type is ReaderType.SCRIPT else self.text_advance(process, output, reader, is_final)
        cost = self.tools.cost(started)
        if cost is not None:
            self.tools.run(ReaderTimeTool, reader.name, cost.total, process.environment_id)
        return advanced

    def text_advance(self, process: Process, output: Output, reader: Reader, is_final: bool) -> ReaderAdvance | None:
        offset = self.folder.reader_offset(process.id, output.reader_position, output.read_offset)
        raw = self.folder.reader_bytes_after(process.id, output.reader_position, offset)
        ready_bytes = raw if is_final else raw[: raw.rfind(NEWLINE) + 1]
        if not ready_bytes:
            return None
        text = ColourCodes.removed(ready_bytes.decode(errors="replace"))
        counted = text.count("\n") + (0 if text.endswith("\n") else 1)
        steps = StepTally.counted(reader.step_pattern, reader.progress_pattern, text)
        restarted = offset != output.read_offset
        passed = steps.passed if restarted else output.steps_passed + steps.passed
        failed = steps.failed if restarted else output.steps_failed + steps.failed
        test_count = self.run.count(reader, text, output.test_count)
        progress = self.run.progress(reader, text, output.progress)
        if not reader.progress_pattern and reader.step_pattern and test_count:
            progress = min(100, (passed + failed) * 100 // test_count)
        first_line = 1 if restarted else output.read_lines + 1
        lines = self.run.lines(reader, text, process.state.value, first_line) if reader.type is ReaderType.PATTERN else []
        return ReaderAdvance(lines, offset + len(ready_bytes), counted if restarted else output.read_lines + counted,
                             self.run.summary(reader, text) or output.reader_summary, progress,
                             steps_passed=passed, steps_failed=failed, test_count=test_count, replaces=restarted)

    def script_advance(self, process: Process, output: Output, reader: Reader, is_final: bool) -> ReaderAdvance | None:
        advanced = self.text_advance(process, output, reader, is_final)
        if not is_final:
            return advanced
        text = self.folder.reader_text(process.id, output.reader_position)
        if advanced is None:
            advanced = ReaderAdvance([], output.read_offset, output.read_lines, output.reader_summary, output.progress,
                                     steps_passed=output.steps_passed, steps_failed=output.steps_failed, test_count=output.test_count)
        return replace(advanced, lines=self.run.lines(reader, text, process.state.value), replaces=True)
