import re
from core.base.driver.command_category import CommandCategory
from core.base.driver.nudge import Nudge
from core.modules.processes.support.process_nudges import READER_DRAFT, OUTPUT_ENDED, READER_MISSED, READER_PROGRESS_MISSING, READER_SUMMARY_MISSING, READER_WIDTH
from pathlib import PurePath

from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_folder import OutputFolder

WIDTH_LINE_COUNT = 50
WIDE_SHARE = 10
COUNTED = re.compile(r"\[ *[0-9]+%\]|\b[0-9]+/[0-9]+\b")
READ_CATEGORIES = (CommandCategory.TEST_RUN, CommandCategory.BUILD, CommandCategory.CHECK, CommandCategory.PACKAGE)
FEW_LINES = 5
SHELL_TERMS = frozenset(("journal", "set", "for", "while", "until", "if", "case", "{", "(", "cd", "export", "time"))


class EndedOutputText:
    """The lines that tell an agent a run of its own ended: what the reader of the run makes of it, else how it
    ended, and how to read it; and how to read such a run better next time."""

    def __init__(self, outputs: OutputQuery, readers: ReaderQuery, folder: OutputFolder, parts: ProcessPartQuery) -> None:
        self.outputs, self.readers, self.folder, self.parts = outputs, readers, folder, parts

    def line(self, process: Process) -> str:
        return f"output {process.id} ended: {self.summary(process) or self.outcome(process)}; journal output read {process.id} --summary"

    def nudges(self, process: Process) -> tuple[Nudge, ...]:
        advice = self.advice(process)
        ended = OUTPUT_ENDED.nudge(text=self.line(process))
        return (ended, READER_DRAFT.nudge(text=advice, name=self.reader_name(process)), *self.reader_nudges(process)) if advice else (ended, *self.reader_nudges(process))

    def reader_name(self, process: Process) -> str:
        return PurePath(self.read_program(process) or "").name

    def read_program(self, process: Process) -> str | None:
        parts = self.parts.process(process.id).oldest().all_rows()
        return next((part.program for part in parts if part.category in READ_CATEGORIES), None)

    def reader_nudges(self, process: Process) -> tuple[Nudge, ...]:
        kept = self.outputs.process(process.id).page(1, 1).rows
        output = kept[0] if kept else None
        if output is None or output.reader_id is None or not output.line_count:
            return ()
        reader = self.readers.find(output.reader_id)
        if reader.type is not ReaderType.PATTERN:
            return ()
        if not output.reader_lines and output.line_count >= FEW_LINES:
            return tuple([READER_MISSED.nudge(reader=reader.name, lines=output.line_count, output=process.id)])
        matches = [READER_WIDTH.nudge(reader=reader.name, kept=output.reader_lines, lines=output.line_count, output=process.id)] if output.line_count >= WIDTH_LINE_COUNT and output.reader_lines * WIDE_SHARE >= output.line_count * (WIDE_SHARE - 1) else []
        if reader.summary_pattern and not output.reader_summary:
            matches.append(READER_SUMMARY_MISSING.nudge(reader=reader.name, output=process.id))
        if not reader.progress_pattern and COUNTED.search(self.folder.last_text(process.id)):
            matches.append(READER_PROGRESS_MISSING.nudge(reader=reader.name, output=process.id))
        return tuple(matches)

    def advice(self, process: Process) -> str:
        kept = self.outputs.process(process.id).page(1, 1).rows
        if not kept or kept[0].reader_id is not None or not kept[0].line_count:
            return ""
        first = self.read_program(process)
        if first is None or first in SHELL_TERMS:
            return ""
        name = PurePath(first).name
        if self.readers.with_name(name).exists():
            return ""
        return f'no reader reads {name} yet: fill in journal reader add {name} --commands "{first}*" --lines "<the lines that matter>" from this run\'s output and run it'

    def summary(self, process: Process) -> str:
        kept = self.outputs.process(process.id).page(1, 1).rows
        return kept[0].reader_summary if kept else ""

    @staticmethod
    def outcome(process: Process) -> str:
        if process.state is ProcessState.FAILED:
            return f"failed with exit code {process.exit_code}"
        return process.state.value
