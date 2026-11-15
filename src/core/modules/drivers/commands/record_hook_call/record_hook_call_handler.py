from core.modules.drivers.support.displayed_blocks import DisplayedBlocks
from engine.agent_step.step_commit import StepCommit
from core.modules.settings.bindings.support.context_share import ContextShare
import json
from collections.abc import Mapping, Sequence

from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from dataclasses import asdict, replace
from engine.command.bus import Bus
from engine.command.command import Command
from engine.agent_step.errors.step_conflict_error import StepConflictError
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.database import Database
from engine.listener.rows.event_rows import EventRows
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.driver.agent_hook import AgentHook
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_reply import HookReply
from engine.driver.project_paths import ProjectPaths
from engine.journal.journal_home import JournalHome
from engine.driver.refusal_line import RefusalLine
from engine.driver.rule_answers import RuleAnswers
from engine.errors.refusal import Refusal
from engine.row.metadata import Metadata
from engine.provider.providers import Providers
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.performance.timing import Timing
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.deliver_agent_line.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.commands.record_hook_call.record_hook_call import RecordHookCall
from core.modules.drivers.commands.support.context_line_split import ContextLineSplit
from core.modules.drivers.commands.support.delivered_lines import DeliveredLines
from core.modules.drivers.commands.support.compaction_end_percent import CompactionEndPercent
from core.modules.drivers.support.required_commands import RequiredCommands
from core.modules.drivers.support.nudge_log import NudgeLog
from core.modules.drivers.commands.support.one_move_per_row import OneMovePerRow
from core.modules.drivers.support.line_history_writer import LineHistoryWriter
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import DISPLAYED_MESSAGE_ID, DISPLAYED_PART, DISPLAYED_TEXT, MONITOR_DESCRIPTION, PROGRAM_SESSION, SUMMARY_CHARACTERS, HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from engine.driver.nudger import Nudger
from engine.driver.search_category import SearchCategory
from core.modules.drivers.support.actor_loader import ActorLoader
from engine.module.driver_entries import DRIVERS_MODULE
from core.modules.agents.support.agent_label import AgentLabel

WAITING_LINES_REASON = "every line waiting for the agent may be handed to it at this hook"

LOG_LINE_CHARACTERS = 240
# the characters kept below a program's own limit for the text of one reply, as room for what the program adds
CONTEXT_LIMIT_MARGIN = 500
OVERFLOW_SOURCE = "drivers.overflow"


class RecordHookCallHandler(Handler[RecordHookCall, HookReply]):
    """Keeps the answers of a hook's rules in one transaction: their history and the hook call, logs the rules
    that refused a stop in one short line, gives the agent its waiting lines, and runs each command the
    rules returned alone, so a refused one rolls back by itself; a tick's lines wait for the agent's next
    hook."""

    command = RecordHookCall
    runs_once = True

    def __init__(self, required_commands: RequiredCommands, bus: Bus, database: Database, queries: Queries, repository: Repository,
                 history: LineHistoryWriter, timing: Timing, providers: Providers, nudges: NudgeLog, nudger: Nudger, agents: AgentRows, event_rows: EventRows, system_log: SystemLogWriter, home: JournalHome, share: ContextShare, compaction_end: CompactionEndPercent, hook_calls: HookCallQuery, loader: ActorLoader, steps: StepWriter, displayed_blocks: DisplayedBlocks) -> None:
        self.steps, self.displayed_blocks = steps, displayed_blocks
        self.home, self.share, self.compaction_end, self.hook_calls, self.loader = home, share, compaction_end, hook_calls, loader
        self.event_rows = event_rows
        self.system_log = system_log
        self.required_commands = required_commands
        self.agents = agents
        self.nudges, self.nudger = nudges, nudger
        self.bus, self.database, self.queries, self.repository = bus, database, queries, repository
        self.history, self.timing, self.providers = history, timing, providers

    def handle(self, command: RecordHookCall, context: Context) -> HookReply:
        agent = self.agents.find(command.agent_id)
        hook = AgentHook.of_actor(command.event, self.loader.loaded(agent), context.timestamp)
        answers = command.answers
        self.history.record(agent.id, answers, context)
        self.timing.stamp("history_recorded")
        self.compaction_end.finish_compaction(command.event, agent, context)
        if command.event.event == HookEventName.TICK and not (answers.refusal or answers.lines or answers.commands):
            if command.step is not None:
                self.steps.save(command.step.view, command.step.step, None, context)
            return HookReply.allowed()
        waiting = self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING).every_row(WAITING_LINES_REASON)
        handed_lines = DeliveredLines.chosen(command.event, answers, tuple(waiting))
        split = ContextLineSplit.split(handed_lines.with_answers(answers), self.context_limit(command.event))
        lines = list(split.kept)
        later = {nudge.text for nudge in split.rest}
        handed_rows = [row for row in handed_lines.rows if row.nudge.text not in later]
        moves = OneMovePerRow.split(answers.commands)
        tool = command.event.tool
        metadata = {**answers.metadata(), "foreign": [asdict(run) for run in command.event.foreign], "folder": str(command.event.raw.get("cwd", "")), "resumed": command.event.is_resume, "compaction_start": command.event.is_compaction_start, "stop_continuation": command.event.is_stop_continuation, "clear_start": command.event.is_clear_start, "ended_session": command.event.session if command.event.event == HookEventName.SESSION_END else "", "manual_compaction": command.event.is_manual_compaction, "search": SearchCategory.classify(tool, str(command.event.raw.get("cwd", "")), self.home.project_folder), "interrupted": command.event.is_interrupt, "background_work": command.event.has_background_work, "dropped": list(moves.dropped), "rewritten_by": answers.rewriter_name, "nudges": [nudge.key for nudge in (*answers.delivered_nudges, *answers.refusal_nudges)]}
        if command.event.event == HookEventName.COMPACT or command.event.is_compaction_start:
            percent = self.share.agent_percent(agent)
            if percent is not None:
                metadata["context_percent"] = percent
        metadata[PROGRAM_SESSION] = command.event.session
        displayed_text = self.displayed_blocks.text(agent.id, command.event)
        if displayed_text:
            metadata[DISPLAYED_TEXT] = displayed_text
        if command.event.displayed_part and not command.event.is_final_display:
            metadata.update({DISPLAYED_PART: command.event.displayed_part, DISPLAYED_MESSAGE_ID: command.event.displayed_message_id})
        if tool is not None and command.event.event == HookEventName.PRE_TOOL_USE:
            metadata["journal_commands"] = list(tool.journal_commands)
        if tool is not None and command.event.event in (HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE):
            metadata.update({"program": command.event.program, "transcript_path": command.event.transcript.text})
        if command.event.is_monitor_tool():
            metadata[MONITOR_DESCRIPTION] = str(command.event.tool_input().get("description", ""))
        call = self.repository.save(HookCall(session_agent_id=agent.id, creator_id=context.actor.id, hook=command.event.event,
                                             firing=command.event.firing, tool=tool.name if tool is not None else "", summary=self.summary(command, displayed_text),
                                             writes_files=tool is not None and tool.is_writing_files(), lines_added=tool.lines_added if tool is not None else 0,
                                             lines_removed=tool.lines_removed if tool is not None else 0, suite=hook.suite,
                                             driver=hook.driver, answer=HookAnswer.REFUSED if answers.refusal else HookAnswer.ALLOWED, refusal=answers.refusal,
                                             lines="\n".join(nudge.text for nudge in lines), updated_input=json.dumps(dict(answers.updated_input)),
                                             metadata=Metadata({DRIVERS_MODULE: metadata})), context)
        refusing = [check.refusal_text for check in answers.stop_checks if check.is_refusal]
        if refusing:
            self.system_log.write(LogLevel.INFORMATION, f"stop {call.id} {AgentLabel.labelled(agent).text} refused: {'; '.join(refusing)}"[:LOG_LINE_CHARACTERS])
        self.nudges.write(agent.id, answers, context)
        self.required_commands.open(agent.id, answers.delivered_nudges, context)
        self.timing.stamp("call_saved")
        for row in handed_rows:
            self.event_rows.remember(row)
        for row in handed_rows:
            self.bus.dispatch(DeliverAgentLine(row.id, call.id, context.timestamp), context)
        commit = self.steps.save(command.step.view, command.step.step, call.id, context) if command.step is not None else None
        if commit is not None and not commit.is_saved:
            raise StepConflictError()
        self.leave_for_next_hook(agent.id, split.rest, answers, {row.nudge.text for row in handed_lines.rows}, context)
        outcomes = [(rule, *self.run_command(rule_command, context)) for rule, rule_command in moves.runnable if rule not in answers.refused_rewriters]
        refused = [(rule, line) for rule, line, _ in outcomes if line]
        output_tools = self.providers.provider(command.event.program).refusal_output_tools
        updated_input = RefusalLine.tool_input(command.event, answers.refusal, output_tools) or self.updated_input(answers, outcomes) or self.machine_input(command, commit)
        if updated_input != answers.updated_input:
            self.repository.save(replace(call, updated_input=json.dumps(dict(updated_input))), context)
        if command.event.event == HookEventName.TICK:
            return self.save_waiting_lines(agent.id, answers, refused, call.id, context)
        return HookReply(answers.refusal, [*(nudge.text for nudge in lines), *(line for _, line in refused)], call.id, updated_input, terminal=answers.terminal,
                         labelled_lines=[*(nudge.labelled for nudge in (*lines, *answers.refusal_nudges)), *(f"journal: {line}" for _, line in refused)])

    def context_limit(self, event: HookEvent) -> int:
        limit = self.providers.provider(event.program).additional_context_limit
        return limit - CONTEXT_LIMIT_MARGIN if limit and event.event != HookEventName.TICK else 0

    # the lines of a reply past the program's limit wait for the agent's next hook, each with the source it came from;
    # a waiting line that did not fit is not delivered, so it waits as it was
    def leave_for_next_hook(self, agent_id: int, rest: Sequence[Nudge], answers: RuleAnswers, waiting_texts: set[str], context: Context) -> None:
        sources = {text: rule for rule, text in answers.rule_lines}
        for nudge in rest:
            if nudge.text not in waiting_texts:
                self.nudger.send_nudge(agent_id, nudge, sources.get(nudge.text, OVERFLOW_SOURCE), context)

    def save_waiting_lines(self, agent_id: int, answers: RuleAnswers, refused: list[tuple[str, str]], call_id: int, context: Context) -> HookReply:
        nudges = {nudge.text: nudge for nudge in answers.delivered_nudges}
        for rule, text in [*answers.rule_lines, *refused]:
            nudge = nudges.get(text)
            if nudge is not None:
                self.nudger.send_nudge(agent_id, nudge, rule, context)
                continue
            self.nudger.send_text(agent_id, text, rule, context)
        return HookReply("", [], call_id)

    def run_command(self, rule_command: Command[object], context: Context) -> tuple[str, object]:
        try:
            with self.database.savepoint(type(rule_command).__name__):
                return "", self.bus.dispatch(rule_command, context.nested(rule_command))
        except Refusal as refusal:
            if refusal.is_completed:
                return "", None
            return f"the journal could not run {type(rule_command).__name__}: {refusal}", None

    def updated_input(self, answers: RuleAnswers, outcomes: list[tuple[str, str, object]]) -> Mapping[str, object]:
        rewriter = answers.rewriter
        build = rewriter.answer.input_after_commands if rewriter is not None and rewriter.answer is not None else None
        if rewriter is None or build is None or any(rule == rewriter.name and line for rule, line, _ in outcomes):
            return answers.updated_input
        return build([command_value for rule, _, command_value in outcomes if rule == rewriter.name])

    # the input the new driver runs an admitted action with: the one its effects built, such as the runner's line, or
    # else the transforms' rewrite; nothing when the old walk still rewrote it
    @staticmethod
    def machine_input(command: RecordHookCall, commit: StepCommit | None) -> Mapping[str, object]:
        if command.step is None or commit is None:
            return {}
        record = command.step.step.record
        if commit.updated_input:
            return commit.updated_input
        return record.rewrite.tool_input if record.rewrite.tool_input is not None and record.decision.admits() else {}

    @staticmethod
    def summary(command: RecordHookCall, displayed_text: str) -> str:
        tool = command.event.tool
        if command.event.is_monitor_tool():
            return str(command.event.tool_input().get("command", ""))[:SUMMARY_CHARACTERS]
        if tool is not None and tool.shell is not None:
            return ProjectPaths.relative_line(tool.shell.display_text, str(command.event.raw.get("cwd", "")))[:SUMMARY_CHARACTERS] if command.event.raw.get("cwd") else tool.shell.display_text[:SUMMARY_CHARACTERS]
        if tool is not None and tool.files:
            return tool.files[0][-SUMMARY_CHARACTERS:]
        return HookCall.summarize(command.event.prompt or displayed_text)
