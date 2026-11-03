import time

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
SECOND_MILLISECONDS = 1000


class ReaderStep:
    """Passes the bytes of an output that arrived since the reader last looked through the reader the output
    keeps; a script reader needs the whole text, so it runs once, when the output ends."""

    def __init__(self, folder: OutputFolder, readers: ReaderQuery, run: ReaderRun, tools: PerformanceTools) -> None:
        self.folder, self.readers, self.run, self.tools = folder, readers, run, tools

    def advance(self, process: Process, output: Output, is_final: bool) -> ReaderAdvance | None:
        if output.reader_id is None:
            return None
        reader = self.readers.find(output.reader_id)
        started = time.monotonic()
        advanced = self.script_advance(process, output, reader, is_final) if reader.type is ReaderType.SCRIPT else self.text_advance(process, output, reader, is_final)
        self.tools.run(ReaderTimeTool, reader.name, round((time.monotonic() - started) * SECOND_MILLISECONDS), process.environment_id)
        return advanced

    def text_advance(self, process: Process, output: Output, reader: Reader, is_final: bool) -> ReaderAdvance | None:
        raw =self.folder.reader_bytes_after(process.id, output.reader_position, output.read_offset)
        ready_bytes = raw if is_final else raw[: raw.rfind(NEWLINE) + 1]
        if not ready_bytes:
            return None
        text = ColourCodes.removed(ready_bytes.decode(errors="replace"))
        counted = text.count("\n") + (0 if text.endswith("\n") else 1)
        steps = StepTally.counted(reader.step_pattern, reader.progress_pattern, text)
        return ReaderAdvance(self.run.lines(reader, text, process.state.value, output.read_lines + 1), output.read_offset + len(ready_bytes), output.read_lines + counted,
                             self.run.summary(reader, text) or output.reader_summary, self.run.progress(reader, text, output.progress),
                             steps_passed=output.steps_passed + steps.passed, steps_failed=output.steps_failed + steps.failed)

    def script_advance(self, process: Process, output: Output, reader: Reader, is_final: bool) -> ReaderAdvance | None:
        if not is_final:
            return None
        text = self.folder.reader_text(process.id, output.reader_position)
        steps = StepTally.counted(reader.step_pattern, reader.progress_pattern, text)
        return ReaderAdvance(self.run.lines(reader, text, process.state.value), len(text.encode()), text.count("\n"), self.run.summary(reader, text), output.progress, replaces=True,
                             steps_passed=steps.passed, steps_failed=steps.failed)
