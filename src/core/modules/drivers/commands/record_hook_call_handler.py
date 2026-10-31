import json
from collections.abc import Mapping
from dataclasses import replace
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.database import Database
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rules import DriverRules
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_reply import HookReply
from core.base.driver.refusal_line import RefusalLine
from core.base.driver.rule_answers import RuleAnswers
from core.base.guard.guard_refusal import GuardRefusal
from core.base.metadata import Metadata
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.timing import Timing
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.deliver_agent_line import DeliverAgentLine
from core.modules.drivers.commands.record_hook_call import RecordHookCall
from core.modules.drivers.commands.support.delivered_lines import DeliveredLines
from core.modules.drivers.commands.support.one_move_per_row import OneMovePerRow
from core.modules.drivers.commands.support.rule_history_writer import RuleHistoryWriter
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.bindings.support.setting_values import SettingValues


DRIVERS_MODULE = "journal.core.drivers"
SUMMARY_CHARACTERS = 200

class RecordHookCallHandler(Handler[RecordHookCall, HookReply]):
    """Answers one hook in one transaction: asks every rule first, keeps their history and the hook call,
    gives the agent its waiting lines, and runs each command the rules returned alone, so a refused one rolls
    back by itself; a tick's lines wait for the agent's next hook."""

    command = RecordHookCall

    def __init__(self, bus: Bus, database: Database, queries: Queries, repository: Repository, rules: DriverRules, choice: SuiteChoice,
                 history: RuleHistoryWriter, timing: Timing, settings: SettingValues, providers: Providers) -> None:
        self.bus, self.database, self.queries, self.repository = bus, database, queries, repository
        self.rules, self.choice, self.history, self.timing, self.settings, self.providers = rules, choice, history, timing, settings, providers

    def handle(self, command: RecordHookCall, context: Context) -> HookReply:
        agent = self.queries.query(Agent).find(command.agent_id)
        suite, driver = self.choice.suite(agent.environment_id), self.choice.driver(agent.environment_id, agent.role)
        hook = AgentHook(command.event, agent.id, agent.environment_id, agent.role, driver.name if driver is not None else "", context.timestamp,
                         suite=suite.name if suite is not None else "")
        self.timing.stamp("hook_built")
        with self.settings.keep_rows():
            answers = self.rules.ask(hook)
        self.timing.stamp("rules_asked")
        self.history.record(agent.id, answers, context)
        self.timing.stamp("history_recorded")
        if command.event.event == HookEventName.TICK and not (answers.refusal or answers.lines or answers.commands):
            return HookReply.allowed()
        waiting = self.queries.query(AgentLine).filter(agent_id=agent.id, state=AgentLineState.WAITING).oldest().all_rows()
        handed_lines = DeliveredLines.chosen(command.event, answers, tuple(waiting))
        moves = OneMovePerRow.split(answers.commands)
        tool = command.event.tool
        call = self.repository.save(HookCall(agent_id=agent.id, environment_id=agent.environment_id, creator_id=context.actor.id, hook=command.event.event,
                                             firing=command.event.firing, tool=tool.name if tool is not None else "", summary=self.summary(command),
                                             writes_files=tool is not None and tool.is_writing_files(), suite=suite.name if suite is not None else "",
                                             driver=hook.driver, answer=HookAnswer.REFUSED if answers.refusal else HookAnswer.ALLOWED, refusal=answers.refusal,
                                             lines="\n".join([*answers.lines, *handed_lines.texts]), updated_input=json.dumps(dict(answers.updated_input)),
                                             metadata=Metadata({DRIVERS_MODULE: {**answers.metadata(), "dropped": list(moves.dropped), "rewritten_by": answers.rewriter_name}})), context)
        self.timing.stamp("call_saved")
        for row in handed_lines.rows:
            self.bus.dispatch(DeliverAgentLine(row.id, call.id, context.timestamp), context)
        outcomes = [(rule, *self.run_command(rule_command, context)) for rule, rule_command in moves.runnable if rule not in answers.refused_rewriters]
        refused = [(rule, line) for rule, line, _ in outcomes if line]
        output_tools = self.providers.provider(command.event.program).refusal_output_tools
        updated_input = RefusalLine.tool_input(command.event, answers.refusal, output_tools) or self.updated_input(answers, outcomes)
        if updated_input != answers.updated_input:
            self.repository.save(replace(call, updated_input=json.dumps(dict(updated_input))), context)
        if command.event.event == HookEventName.TICK:
            return self.save_waiting_lines(agent.id, [*answers.rule_lines, *refused], call.id, context)
        return HookReply(answers.refusal, [*answers.lines, *handed_lines.texts, *(line for _, line in refused)], call.id, updated_input)

    def save_waiting_lines(self, agent_id: int, rule_lines: list[tuple[str, str]], call_id: int, context: Context) -> HookReply:
        for rule, text in rule_lines:
            self.repository.save(AgentLine(agent_id=agent_id, creator_id=context.actor.id, text=text, source=rule), context)
        return HookReply("", [], call_id)

    def run_command(self, rule_command: Command[object], context: Context) -> tuple[str, object]:
        try:
            with self.database.savepoint(type(rule_command).__name__):
                return "", self.bus.dispatch(rule_command, context.nested(rule_command))
        except GuardRefusal as refusal:
            return f"the journal could not run {type(rule_command).__name__}: {refusal}", None

    def updated_input(self, answers: RuleAnswers, outcomes: list[tuple[str, str, object]]) -> Mapping[str, object]:
        rewriter = answers.rewriter
        build = rewriter.answer.input_after_commands if rewriter is not None and rewriter.answer is not None else None
        if rewriter is None or build is None or any(rule == rewriter.name and line for rule, line, _ in outcomes):
            return answers.updated_input
        return build([command_value for rule, _, command_value in outcomes if rule == rewriter.name])

    def summary(self, command: RecordHookCall) -> str:
        tool = command.event.tool
        if tool is not None and tool.shell is not None:
            return tool.shell.line[:SUMMARY_CHARACTERS]
        if tool is not None and tool.files:
            return tool.files[0][:SUMMARY_CHARACTERS]
        return (command.event.prompt or "").split("\n", 1)[0][:SUMMARY_CHARACTERS]
