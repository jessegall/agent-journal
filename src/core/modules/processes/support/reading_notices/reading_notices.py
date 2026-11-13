from pathlib import PurePath

from engine.actor.actor import Actor
from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.actor_type import ActorType
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reason_code import ReasonCode
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.process_nudges import (DRAFT_READY, READER_DRAFT, READER_FAILED, UNREADABLE_BINARY, UNREADABLE_DECLARED, UNREADABLE_EMPTY,
                                                          UNREADABLE_INTERACTIVE, UNREADABLE_LIFTED, UNREADABLE_SINGLE_LINE, READER_MISSED, READER_PROGRESS_MISSING, READER_SUMMARY_MISSING, READER_WIDTH,
                                                          SILENT_SAVED_FAILURE)
from core.modules.processes.support.decisions.reading_decisions import ReadingDecisions
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.support.run_visibility import RunVisibility

PICKED_NONE = "--lines picked none"
WIDTH_FIELDS = ("reader", "kept", "lines", "output")
NAMED_FIELDS = ("reader", "output")
MISS_NUDGES: dict[str, tuple[NudgeDeclaration, tuple[str, ...]]] = {"--lines picked nearly all": (READER_WIDTH, WIDTH_FIELDS),
                                                                    "--summary found nothing": (READER_SUMMARY_MISSING, NAMED_FIELDS),
                                                                    "--progress found nothing": (READER_PROGRESS_MISSING, NAMED_FIELDS),
                                                                    "--progress found only at the end": (READER_PROGRESS_MISSING, NAMED_FIELDS)}
MARK_NUDGES: dict[UnreadableReason, NudgeDeclaration] = {UnreadableReason.EMPTY: UNREADABLE_EMPTY, UnreadableReason.BINARY: UNREADABLE_BINARY,
                                                     UnreadableReason.SINGLE_LINE: UNREADABLE_SINGLE_LINE, UnreadableReason.INTERACTIVE: UNREADABLE_INTERACTIVE,
                                                     UnreadableReason.DECLARED: UNREADABLE_DECLARED}
SHELL_TERMS = frozenset(("journal", "set", "for", "while", "until", "if", "case", "{", "(", "cd", "export", "time", "bash", "sh", "zsh"))


class ReadingNotices:
    """The lines that tell an agent, when a run it moved to the background ended, how to read such a
    run better: a saved command that failed silently, a reader to draft, and what the reader of the
    run missed. Only an agent that may write readers is told how to read better."""

    def __init__(self, readers: ReaderQuery, judge: ReaderJudge, writers: ReaderWriters, rows: EventRows, decisions: ReadingDecisions) -> None:
        self.readers, self.judge, self.writers, self.rows, self.decisions = readers, judge, writers, rows, decisions

    def nudges(self, process: Process, output: Output | None, parts: tuple[ProcessPart, ...]) -> tuple[Nudge, ...]:
        if process.moved_at is None:
            return ()
        failures = self.silent_failure_nudges(process, output, parts)
        if not self.writers.allows(Actor(process.session_agent_id, ActorType.AGENT)) or RunVisibility.select_visible_part(process, parts) is None:
            return failures
        decisions = self.decisions.kept(process, ReadingMoment.END)
        read_position = output.reader_position if output is not None and output.reader_position else 1
        if read_position in decisions and decisions[read_position].state is ReaderState.UNREADABLE:
            return failures
        return (*failures, *self.draft_nudges(process, output, parts, decisions), *self.reader_nudges(process, output, parts, decisions.get(read_position)))

    # The one line about each mark made or lifted at the end of a run: a lifted mark names its command, a mark the
    # engine made names the output, and a declared mark names its command.
    @staticmethod
    def mark_nudges(process: Process, changes: tuple[UnreadableMark, ...]) -> tuple[Nudge, ...]:
        return tuple(ReadingNotices.mark_nudge(process, mark) for mark in changes)

    @staticmethod
    def mark_nudge(process: Process, mark: UnreadableMark) -> Nudge:
        if mark.lifted_at is not None:
            return UNREADABLE_LIFTED.nudge(name=mark.words)
        if mark.reason is UnreadableReason.DECLARED:
            return UNREADABLE_DECLARED.nudge(name=mark.words)
        return MARK_NUDGES[mark.reason].nudge(output=process.id)

    @staticmethod
    def silent_failure_nudges(process: Process, output: Output | None, parts: tuple[ProcessPart, ...]) -> tuple[Nudge, ...]:
        if process.state is not ProcessState.FAILED or output is None or output.byte_count:
            return ()
        saved = next((part.saved_command for part in parts if part.saved_command), "")
        return tuple([SILENT_SAVED_FAILURE.nudge(name=saved)]) if saved else ()

    def draft_nudges(self, process: Process, output: Output | None, parts: tuple[ProcessPart, ...], decisions: dict[int, ReadingDecisionRow]) -> tuple[Nudge, ...]:
        read = next((part for part in parts if part.category.has_result_output), None)
        if output is None or output.reader_id is not None or not output.line_count or read is None or not read.program or read.program in SHELL_TERMS:
            return ()
        name = PurePath(read.program).name
        if self.readers.with_name(name).exists():
            return ()
        if read.position in decisions and decisions[read.position].action is ReaderAction.DRAFT_READY:
            return tuple([DRAFT_READY.nudge(name=name, output=process.id)])
        return tuple([READER_DRAFT.nudge(name=name)])

    def reader_nudges(self, process: Process, output: Output | None, process_parts: tuple[ProcessPart, ...], decision: ReadingDecisionRow | None) -> tuple[Nudge, ...]:
        if output is None or output.reader_id is None or not output.line_count:
            return ()
        reader = self.rows.required(Reader, output.reader_id)
        if decision is not None and decision.reason is ReasonCode.READER_FAILED:
            return tuple([READER_FAILED.nudge(reader=reader.name, output=process.id)])
        if reader.type is not ReaderType.PATTERN:
            return ()
        parts = [part for part in process_parts if not output.reader_position or part.position == output.reader_position]
        missed = tuple(dict.fromkeys(miss for part in parts for miss in self.judge.misses_read_output(reader, part.category, output)))
        if PICKED_NONE in missed:
            return tuple([READER_MISSED.nudge(reader=reader.name, lines=output.line_count, output=process.id)])
        values = {"reader": reader.name, "kept": output.reader_lines, "lines": output.line_count, "output": process.id}
        advice = [nudge for miss, nudge in MISS_NUDGES.items() if miss in missed and (nudge[0] is not READER_SUMMARY_MISSING or reader.summary_pattern)]
        nudges = (declaration.nudge(**{field: values[field] for field in fields}) for declaration, fields in advice)
        return tuple({nudge.text: nudge for nudge in nudges}.values())
