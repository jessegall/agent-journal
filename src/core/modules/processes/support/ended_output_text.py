from core.base.driver.nudge import Nudge
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.processes.support.process_nudges import READER_DRAFT, OUTPUT_ENDED, READER_MISSED, READER_PROGRESS_MISSING, READER_SUMMARY_MISSING, READER_WIDTH, SILENT_SAVED_FAILURE
from pathlib import PurePath

from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.base.listener.event_rows import EventRows
from core.modules.processes.models.enums.reader_type import ReaderType
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

    def __init__(self, outputs: OutputQuery, readers: ReaderQuery, visibility: RunVisibility, judge: ReaderJudge, writers: ReaderWriters, rows: EventRows) -> None:
        self.outputs, self.readers, self.visibility, self.judge, self.writers, self.rows = outputs, readers, visibility, judge, writers, rows

    def nudges(self, process: Process) -> tuple[Nudge, ...]:
        ended = (OUTPUT_ENDED.nudge(output=process.id), *self.silent_failure_nudges(process))
        if not self.writers.allows(Actor(process.session_agent_id, ActorType.AGENT)) or not self.visibility.is_visible(process):
            return ended
        program = self.read_program(process)
        draft = [READER_DRAFT.nudge(name=PurePath(program).name)] if self.needs_reader(process) and program else []
        return (*ended, *draft, *self.reader_nudges(process))

    def silent_failure_nudges(self, process: Process) -> tuple[Nudge, ...]:
        output = self.outputs.process_output(process.id)
        if process.state is not ProcessState.FAILED or output is None or output.byte_count:
            return ()
        saved = next((part.saved_command for part in self.visibility.parts(process.id) if part.saved_command), "")
        return tuple([SILENT_SAVED_FAILURE.nudge(name=saved)]) if saved else ()

    def read_program(self, process: Process) -> str | None:
        parts = self.visibility.parts(process.id)
        return next((part.program for part in parts if part.category.has_result_output), None)

    def reader_nudges(self, process: Process) -> tuple[Nudge, ...]:
        output = self.outputs.process_output(process.id)
        if output is None or output.reader_id is None or not output.line_count:
            return ()
        reader = self.rows.required(Reader, output.reader_id)
        if reader.type is not ReaderType.PATTERN:
            return ()
        parts = [part for part in self.visibility.parts(process.id) if not output.reader_position or part.position == output.reader_position]
        missed = tuple(dict.fromkeys(miss for part in parts for miss in self.judge.misses_read_output(reader, part.category, output)))
        if "--lines picked none" in missed:
            return tuple([READER_MISSED.nudge(reader=reader.name, lines=output.line_count, output=process.id)])
        matches = [READER_WIDTH.nudge(reader=reader.name, kept=output.reader_lines, lines=output.line_count, output=process.id)] if "--lines picked nearly all" in missed else []
        if reader.summary_pattern and "--summary found nothing" in missed:
            matches.append(READER_SUMMARY_MISSING.nudge(reader=reader.name, output=process.id))
        if "--progress found nothing" in missed or "--progress found only at the end" in missed:
            matches.append(READER_PROGRESS_MISSING.nudge(reader=reader.name, output=process.id))
        return tuple(matches)

    def needs_reader(self, process: Process) -> bool:
        output = self.outputs.process_output(process.id)
        if output is None or output.reader_id is not None or not output.line_count:
            return False
        first = self.read_program(process)
        if first is None or first in SHELL_TERMS:
            return False
        name = PurePath(first).name
        return not self.readers.with_name(name).exists()

