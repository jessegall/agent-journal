from core.base.driver.nudge import Nudge
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.processes.support.process_nudges import READER_DRAFT, OUTPUT_ENDED, READER_MISSED, READER_PROGRESS_MISSING, READER_SUMMARY_MISSING, READER_WIDTH
from pathlib import PurePath

from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.support.reader_writers import ReaderWriters

SHELL_TERMS = frozenset(("journal", "set", "for", "while", "until", "if", "case", "{", "(", "cd", "export", "time", "bash", "sh", "zsh"))


class EndedOutputText:
    """The lines that tell an agent a run of its own ended: what the reader of the run makes of it, else
    how it ended, and how to read it; and, for a run shown in the chat, how to read such a run better next
    time."""

    def __init__(self, outputs: OutputQuery, readers: ReaderQuery, parts: ProcessPartQuery, visibility: RunVisibility, judge: ReaderJudge, writers: ReaderWriters) -> None:
        self.outputs, self.readers, self.parts, self.visibility, self.judge, self.writers = outputs, readers, parts, visibility, judge, writers

    def nudges(self, process: Process) -> tuple[Nudge, ...]:
        ended = OUTPUT_ENDED.nudge(output=process.id, result=self.result(process))
        if not self.writers.allows(Actor(process.agent_id, ActorType.AGENT)) or not self.visibility.is_visible(process):
            return tuple([ended])
        program = self.read_program(process)
        draft = [READER_DRAFT.nudge(name=PurePath(program).name)] if self.needs_reader(process) and program else []
        return (ended, *draft, *self.reader_nudges(process))

    def result(self, process: Process) -> str:
        summary = self.summary(process)
        return summary if summary else self.outcome(process)

    def read_program(self, process: Process) -> str | None:
        parts = self.parts.process(process.id).oldest().all_rows()
        return next((part.program for part in parts if part.category.has_result_output), None)

    def reader_nudges(self, process: Process) -> tuple[Nudge, ...]:
        kept = self.outputs.process(process.id).page(1, 1).rows
        output = kept[0] if kept else None
        if output is None or output.reader_id is None or not output.line_count:
            return ()
        reader = self.readers.find(output.reader_id)
        if reader.type is not ReaderType.PATTERN:
            return ()
        missed = self.judge.misses(reader, process.category, self.judge.output_text(process.id, output.reader_position))
        if "--lines picked none" in missed:
            return tuple([READER_MISSED.nudge(reader=reader.name, lines=output.line_count, output=process.id)])
        matches = [READER_WIDTH.nudge(reader=reader.name, kept=output.reader_lines, lines=output.line_count, output=process.id)] if "--lines picked nearly all" in missed else []
        if reader.summary_pattern and "--summary found nothing" in missed:
            matches.append(READER_SUMMARY_MISSING.nudge(reader=reader.name, output=process.id))
        if not reader.progress_pattern and "--progress found nothing" in missed:
            matches.append(READER_PROGRESS_MISSING.nudge(reader=reader.name, output=process.id))
        return tuple(matches)

    def needs_reader(self, process: Process) -> bool:
        kept = self.outputs.process(process.id).page(1, 1).rows
        if not kept or kept[0].reader_id is not None or not kept[0].line_count:
            return False
        first = self.read_program(process)
        if first is None or first in SHELL_TERMS:
            return False
        name = PurePath(first).name
        return not self.readers.with_name(name).exists()

    def summary(self, process: Process) -> str:
        kept = self.outputs.process(process.id).page(1, 1).rows
        return kept[0].reader_summary if kept else ""

    @staticmethod
    def outcome(process: Process) -> str:
        if process.state is ProcessState.FAILED:
            return f"failed with exit code {process.exit_code}"
        return process.state.value
