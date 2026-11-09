from core.modules.settings.bindings.support.context_share import ContextShare
import json
from collections.abc import Mapping
from dataclasses import asdict, replace
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.database import Database
from core.base.listener.event_rows import EventRows
from core.base.log_level import LogLevel
from core.base.system_log_writer import SystemLogWriter
from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool_type import ToolType
from core.base.driver.hook_reply import HookReply
from core.base.driver.project_paths import ProjectPaths
from core.base.journal_home import JournalHome
from core.base.driver.refusal_line import RefusalLine
from core.base.driver.rule_answers import RuleAnswers
from core.base.refusal import Refusal
from core.base.metadata import Metadata
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timing import Timing
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.deliver_agent_line.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.commands.record_hook_call.record_hook_call import RecordHookCall
from core.modules.drivers.commands.support.delivered_lines import DeliveredLines
from core.modules.drivers.commands.support.compaction_end_percent import CompactionEndPercent
from core.modules.drivers.commands.support.required_commands import RequiredCommands
from core.modules.drivers.support.nudge_log import NudgeLog
from core.modules.drivers.commands.support.one_move_per_row import OneMovePerRow
from core.modules.drivers.commands.support.rule_history_writer import RuleHistoryWriter
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import DISPLAYED_MESSAGE_ID, DISPLAYED_PART, DISPLAYED_TEXT, MONITOR_DESCRIPTION, SUMMARY_CHARACTERS, HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.nudger import Nudger
from core.base.driver.search_category import SearchCategory
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.module.driver_entries import DRIVERS_MODULE


class RecordHookCallHandler(Handler[RecordHookCall, HookReply]):
    """Keeps the answers of a hook's rules in one transaction: their history and the hook call,
    gives the agent its waiting lines, and runs each command the rules returned alone, so a refused one rolls
    back by itself; a tick's lines wait for the agent's next hook."""

    command = RecordHookCall
    runs_once = True

    def __init__(self, required_commands: RequiredCommands, bus: Bus, database: Database, queries: Queries, repository: Repository, choice: SuiteChoice,
                 history: RuleHistoryWriter, timing: Timing, providers: Providers, nudges: NudgeLog, nudger: Nudger, agents: AgentRows, event_rows: EventRows, system_log: SystemLogWriter, home: JournalHome, share: ContextShare, compaction_end: CompactionEndPercent, hook_calls: HookCallQuery) -> None:
        self.home, self.share, self.compaction_end, self.hook_calls = home, share, compaction_end, hook_calls
        self.event_rows = event_rows
        self.system_log = system_log
        self.required_commands = required_commands
        self.agents = agents
        self.nudges, self.nudger = nudges, nudger
        self.bus, self.database, self.queries, self.repository = bus, database, queries, repository
        self.choice, self.history, self.timing, self.providers = choice, history, timing, providers

    def handle(self, command: RecordHookCall, context: Context) -> HookReply:
        agent = self.agents.find(command.agent_id)
        suite, driver = self.choice.suite(), self.choice.driver(agent.role)
        hook = AgentHook(command.event, agent.id, agent.environment_id, agent.role, driver.name if driver is not None else "", context.timestamp,
                         suite=suite.name if suite is not None else "", access=agent.access)
        answers = command.answers
        self.history.record(agent.id, answers, context)
        self.timing.stamp("history_recorded")
        self.compaction_end.finish_compaction(command.event, agent, context)
        if command.event.event == HookEventName.TICK and not (answers.refusal or answers.lines or answers.commands):
            return HookReply.allowed()
        waiting = self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING).oldest().all_rows()
        handed_lines = DeliveredLines.chosen(command.event, answers, tuple(waiting))
        lines = handed_lines.with_answers(answers)
        moves = OneMovePerRow.split(answers.commands)
        tool = command.event.tool
        metadata = {**answers.metadata(), "foreign": [asdict(run) for run in command.event.foreign], "folder": str(command.event.raw.get("cwd", "")), "resumed": command.event.is_resume, "compaction_start": command.event.is_compaction_start, "clear_start": command.event.is_clear_start, "ended_session": command.event.session if command.event.event == HookEventName.SESSION_END else "", "manual_compaction": command.event.is_manual_compaction, "search": SearchCategory.classify(tool, str(command.event.raw.get("cwd", "")), self.home.project_folder), "interrupted": command.event.is_interrupt, "dropped": list(moves.dropped), "rewritten_by": answers.rewriter_name, "nudges": [nudge.key for nudge in (*answers.delivered_nudges, *answers.refusal_nudges)]}
        if command.event.event == HookEventName.COMPACT or command.event.is_compaction_start:
            percent = self.share.percent(command.event.program, command.event.session)
            if percent is not None:
                metadata["context_percent"] = percent
        displayed_text = self.hook_calls.displayed_block(agent.id, command.event)
        if displayed_text:
            metadata[DISPLAYED_TEXT] = displayed_text
        if command.event.displayed_part and not command.event.is_final_display:
            metadata.update({DISPLAYED_PART: command.event.displayed_part, DISPLAYED_MESSAGE_ID: command.event.displayed_message_id})
        if tool is not None and command.event.event == HookEventName.PRE_TOOL_USE:
            metadata.update({"journal_commands": list(tool.journal_commands), "program": command.event.program, "transcript_path": command.event.transcript.text})
        if self.is_monitoring(command):
            metadata[MONITOR_DESCRIPTION] = str(command.event.tool_input().get("description", ""))
        call = self.repository.save(HookCall(session_agent_id=agent.id, creator_id=context.actor.id, hook=command.event.event,
                                             firing=command.event.firing, tool=tool.name if tool is not None else "", summary=self.summary(command, displayed_text),
                                             writes_files=tool is not None and tool.is_writing_files(), lines_added=tool.lines_added if tool is not None else 0,
                                             lines_removed=tool.lines_removed if tool is not None else 0, suite=suite.name if suite is not None else "",
                                             driver=hook.driver, answer=HookAnswer.REFUSED if answers.refusal else HookAnswer.ALLOWED, refusal=answers.refusal,
                                             lines="\n".join(nudge.text for nudge in lines), updated_input=json.dumps(dict(answers.updated_input)),
                                             metadata=Metadata({DRIVERS_MODULE: metadata})), context)
        if answers.stop_checks:
            self.system_log.write(LogLevel.INFORMATION, f"stop {call.id} agent {agent.id} {call.answer.value}: {json.dumps([asdict(check) for check in answers.stop_checks])}")
        self.nudges.write(agent.id, answers, context)
        self.required_commands.open(agent.id, answers.delivered_nudges, context)
        self.timing.stamp("call_saved")
        for row in handed_lines.rows:
            self.event_rows.remember(row)
        for row in handed_lines.rows:
            self.bus.dispatch(DeliverAgentLine(row.id, call.id, context.timestamp), context)
        outcomes = [(rule, *self.run_command(rule_command, context)) for rule, rule_command in moves.runnable if rule not in answers.refused_rewriters]
        refused = [(rule, line) for rule, line, _ in outcomes if line]
        output_tools = self.providers.provider(command.event.program).refusal_output_tools
        updated_input = RefusalLine.tool_input(command.event, answers.refusal, output_tools) or self.updated_input(answers, outcomes)
        if updated_input != answers.updated_input:
            self.repository.save(replace(call, updated_input=json.dumps(dict(updated_input))), context)
        if command.event.event == HookEventName.TICK:
            return self.save_waiting_lines(agent.id, answers, refused, call.id, context)
        return HookReply(answers.refusal, [*(nudge.text for nudge in lines), *(line for _, line in refused)], call.id, updated_input, terminal=answers.terminal,
                         labelled_lines=[*(nudge.labelled for nudge in (*lines, *answers.refusal_nudges)), *(f"journal: {line}" for _, line in refused)])

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

    @staticmethod
    def is_monitoring(command: RecordHookCall) -> bool:
        tool = command.event.tool
        return tool is not None and tool.category is ToolType.MONITOR

    def summary(self, command: RecordHookCall, displayed_text: str) -> str:
        tool = command.event.tool
        if self.is_monitoring(command):
            return str(command.event.tool_input().get("command", ""))[:SUMMARY_CHARACTERS]
        if tool is not None and tool.shell is not None:
            return ProjectPaths.relative_line(tool.shell.display_text, str(command.event.raw.get("cwd", "")))[:SUMMARY_CHARACTERS] if command.event.raw.get("cwd") else tool.shell.display_text[:SUMMARY_CHARACTERS]
        if tool is not None and tool.files:
            return tool.files[0][-SUMMARY_CHARACTERS:]
        return HookCall.summarize(command.event.prompt or displayed_text)
