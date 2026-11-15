from pathlib import PurePath

from engine.actor.actor import Actor
from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from engine.enums.actor_type import ActorType
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reason_code import ReasonCode
from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.agent_messages.draft_ready_message import DraftReadyMessage
from core.modules.processes.agent_messages.reader_draft_message import ReaderDraftMessage
from core.modules.processes.agent_messages.reader_failed_message import ReaderFailedMessage
from core.modules.processes.agent_messages.unreadable_binary_message import UnreadableBinaryMessage
from core.modules.processes.agent_messages.unreadable_declaration_message import UnreadableDeclarationMessage
from core.modules.processes.agent_messages.unreadable_empty_message import UnreadableEmptyMessage
from core.modules.processes.agent_messages.unreadable_interactive_message import UnreadableInteractiveMessage
from core.modules.processes.agent_messages.unreadable_lifted_message import UnreadableLiftedMessage
from core.modules.processes.agent_messages.unreadable_single_line_message import UnreadableSingleLineMessage
from core.modules.processes.agent_messages.reader_missed_message import ReaderMissedMessage
from core.modules.processes.agent_messages.reader_progress_missing_message import ReaderProgressMissingMessage
from core.modules.processes.agent_messages.reader_summary_missing_message import ReaderSummaryMissingMessage
from core.modules.processes.agent_messages.reader_width_message import ReaderWidthMessage
from core.modules.processes.agent_messages.silent_saved_failure_message import SilentSavedFailureMessage
from core.modules.processes.support.decisions.reading_decisions import ReadingDecisions
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.support.run_visibility import RunVisibility

SELECTED_NONE = "--lines picked none"
WIDTH_FIELDS = ("reader", "kept", "lines", "output")
LISTED_FIELDS = ("reader", "output")
MISS_AGENT_MESSAGES: dict[str, tuple[MessageTemplate, tuple[str, ...]]] = {"--lines picked nearly all": (ReaderWidthMessage.declared(), WIDTH_FIELDS),
                                                                    "--summary found nothing": (ReaderSummaryMissingMessage.declared(), LISTED_FIELDS),
                                                                    "--progress found nothing": (ReaderProgressMissingMessage.declared(), LISTED_FIELDS),
                                                                    "--progress found only at the end": (ReaderProgressMissingMessage.declared(), LISTED_FIELDS)}
MARK_AGENT_MESSAGES: dict[UnreadableReason, MessageTemplate] = {UnreadableReason.EMPTY: UnreadableEmptyMessage.declared(), UnreadableReason.BINARY: UnreadableBinaryMessage.declared(),
                                                     UnreadableReason.SINGLE_LINE: UnreadableSingleLineMessage.declared(), UnreadableReason.INTERACTIVE: UnreadableInteractiveMessage.declared(),
                                                     UnreadableReason.DECLARED: UnreadableDeclarationMessage.declared()}
SHELL_TERMS = frozenset(("journal", "set", "for", "while", "until", "if", "case", "{", "(", "cd", "export", "time", "bash", "sh", "zsh"))


class ReadingNotices:
    """The lines that tell an agent, when a run it moved to the background ended, how to read such a
    run better: a saved command that failed silently, a reader to draft, and what the reader of the
    run missed. Only an agent that may write readers is told how to read better."""

    def __init__(self, readers: ReaderQuery, judge: ReaderJudge, writers: ReaderWriters, rows: EventRows, decisions: ReadingDecisions) -> None:
        self.readers, self.judge, self.writers, self.rows, self.decisions = readers, judge, writers, rows, decisions

    def agent_messages(self, process: Process, output: Output | None, parts: tuple[ProcessPart, ...]) -> tuple[AgentMessage, ...]:
        if process.moved_at is None:
            return ()
        failures = self.silent_failure_agent_messages(process, output, parts)
        if not self.writers.allows(Actor(process.session_agent_id, ActorType.AGENT)) or RunVisibility.select_visible_part(process, parts) is None:
            return failures
        decisions = self.decisions.kept(process, ReadingPhase.END)
        read_position = output.reader_position if output is not None and output.reader_position else 1
        if read_position in decisions and decisions[read_position].state is ReaderState.UNREADABLE:
            return failures
        return (*failures, *self.draft_agent_messages(process, output, parts, decisions), *self.reader_agent_messages(process, output, parts, decisions.get(read_position)))

    # The one line about each mark made or lifted at the end of a run: a lifted mark names its command, a mark the
    # engine made names the output, and a declared mark names its command.
    @staticmethod
    def mark_agent_messages(process: Process, changes: tuple[UnreadableMark, ...]) -> tuple[AgentMessage, ...]:
        return tuple(ReadingNotices.mark_agent_message(process, mark) for mark in changes)

    @staticmethod
    def mark_agent_message(process: Process, mark: UnreadableMark) -> AgentMessage:
        if mark.lifted_at is not None:
            return UnreadableLiftedMessage.declared().agent_message(name=mark.terms)
        if mark.reason is UnreadableReason.DECLARED:
            return UnreadableDeclarationMessage.declared().agent_message(name=mark.terms)
        return MARK_AGENT_MESSAGES[mark.reason].agent_message(output=process.id)

    @staticmethod
    def silent_failure_agent_messages(process: Process, output: Output | None, parts: tuple[ProcessPart, ...]) -> tuple[AgentMessage, ...]:
        if process.state is not ProcessState.FAILED or output is None or output.byte_count:
            return ()
        saved = next((part.saved_command for part in parts if part.saved_command), "")
        return tuple([SilentSavedFailureMessage.declared().agent_message(name=saved)]) if saved else ()

    def draft_agent_messages(self, process: Process, output: Output | None, parts: tuple[ProcessPart, ...], decisions: dict[int, ReadingDecisionRow]) -> tuple[AgentMessage, ...]:
        read = next((part for part in parts if part.category.has_result_output), None)
        if output is None or output.reader_id is not None or not output.line_count or read is None or not read.program or read.program in SHELL_TERMS:
            return ()
        name = PurePath(read.program).name
        if self.readers.with_name(name).exists():
            return ()
        if read.position in decisions and decisions[read.position].action is ReaderAction.DRAFT_READY:
            return tuple([DraftReadyMessage.declared().agent_message(name=name, output=process.id)])
        return tuple([ReaderDraftMessage.declared().agent_message(name=name)])

    def reader_agent_messages(self, process: Process, output: Output | None, process_parts: tuple[ProcessPart, ...], decision: ReadingDecisionRow | None) -> tuple[AgentMessage, ...]:
        if output is None or output.reader_id is None or not output.line_count:
            return ()
        reader = self.rows.required(Reader, output.reader_id)
        if decision is not None and decision.reason is ReasonCode.READER_FAILED:
            return tuple([ReaderFailedMessage.declared().agent_message(reader=reader.name, output=process.id)])
        if reader.type is not ReaderType.PATTERN:
            return ()
        parts = [part for part in process_parts if not output.reader_position or part.position == output.reader_position]
        missed = tuple(dict.fromkeys(miss for part in parts for miss in self.judge.misses_read_output(reader, part.category, output)))
        if SELECTED_NONE in missed:
            return tuple([ReaderMissedMessage.declared().agent_message(reader=reader.name, lines=output.line_count, output=process.id)])
        values = {"reader": reader.name, "kept": output.reader_lines, "lines": output.line_count, "output": process.id}
        hint = [agent_message for miss, agent_message in MISS_AGENT_MESSAGES.items() if miss in missed and (agent_message[0] is not ReaderSummaryMissingMessage.declared() or reader.summary_pattern)]
        agent_messages = (declaration.agent_message(**{field: values[field] for field in fields}) for declaration, fields in hint)
        return tuple({agent_message.text: agent_message for agent_message in agent_messages}.values())
