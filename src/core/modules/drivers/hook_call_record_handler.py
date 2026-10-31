from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.database import Database
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rules import DriverRules
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_reply import HookReply
from core.base.guard_refusal import GuardRefusal
from core.base.metadata import Metadata
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.agent import Agent
from core.modules.drivers.agent_line import AgentLine
from core.modules.drivers.agent_line_give import AgentLineGive
from core.modules.drivers.agent_line_state import AgentLineState
from core.modules.drivers.given_lines import GivenLines
from core.modules.drivers.hook_answer import HookAnswer
from core.modules.drivers.hook_call import HookCall
from core.modules.drivers.hook_call_record import HookCallRecord
from core.modules.drivers.one_move_per_row import OneMovePerRow
from core.modules.drivers.rule_history_writer import RuleHistoryWriter
from core.modules.drivers.suite_choice import SuiteChoice

DRIVERS_MODULE = "journal.core.drivers"
SUMMARY_CHARACTERS = 200


class HookCallRecordHandler(Handler[HookCallRecord, HookReply]):
    """Answers one hook in one transaction: asks every rule first, keeps their history and the hook call,
    gives the agent its waiting lines, and runs each command the rules returned alone, so a refused one rolls
    back by itself."""

    command = HookCallRecord

    def __init__(self, bus: Bus, database: Database, queries: Queries, repository: Repository, rules: DriverRules, choice: SuiteChoice,
                 history: RuleHistoryWriter) -> None:
        self.bus, self.database, self.queries, self.repository = bus, database, queries, repository
        self.rules, self.choice, self.history = rules, choice, history

    def handle(self, command: HookCallRecord, context: Context) -> HookReply:
        agent = self.queries.query(Agent).find(command.agent_id)
        suite, driver = self.choice.suite(agent.environment_id), self.choice.driver(agent.environment_id, agent.role)
        hook = AgentHook(command.event, agent.id, agent.environment_id, agent.role, driver.name if driver is not None else "", context.timestamp,
                         suite=suite.name if suite is not None else "")
        answers = self.rules.ask(hook)
        self.history.record(agent.id, answers, context)
        if command.event.event == HookEventName.TICK and not (answers.refusal or answers.lines or answers.commands):
            return HookReply.allowed()
        waiting = self.queries.query(AgentLine).filter(agent_id=agent.id, state=AgentLineState.WAITING).oldest().all_rows()
        handed_lines = GivenLines.chosen(command.event, answers, tuple(waiting))
        moves = OneMovePerRow.split(answers.commands)
        tool = command.event.tool
        call = self.repository.save(HookCall(agent_id=agent.id, environment_id=agent.environment_id, creator_id=context.actor.id, hook=command.event.event,
                                             firing=command.event.firing, tool=tool.name if tool is not None else "", summary=self.summary(command),
                                             writes_files=tool is not None and tool.category in ("edit", "write"), suite=suite.name if suite is not None else "",
                                             driver=hook.driver, answer=HookAnswer.REFUSED if answers.refusal else HookAnswer.ALLOWED, refusal=answers.refusal,
                                             lines="\n".join([*answers.lines, *handed_lines.texts]),
                                             metadata=Metadata({DRIVERS_MODULE: {**answers.metadata(), "dropped": list(moves.dropped)}})), context)
        for row in handed_lines.rows:
            self.bus.dispatch(AgentLineGive(row.id, call.id, context.timestamp), context)
        refused = [line for _, rule_command in moves.runnable if (line := self.refusal_line(rule_command, context))]
        return HookReply(answers.refusal, [*answers.lines, *handed_lines.texts, *refused], call.id)

    def refusal_line(self, rule_command: Command[object], context: Context) -> str:
        try:
            with self.database.savepoint(type(rule_command).__name__):
                self.bus.dispatch(rule_command, context.nested(rule_command))
        except GuardRefusal as refusal:
            return f"the journal could not run {type(rule_command).__name__}: {refusal}"
        return ""

    def summary(self, command: HookCallRecord) -> str:
        tool = command.event.tool
        if tool is not None and tool.shell is not None:
            return tool.shell.line[:SUMMARY_CHARACTERS]
        if tool is not None and tool.files:
            return tool.files[0][:SUMMARY_CHARACTERS]
        return (command.event.prompt or "").split("\n", 1)[0][:SUMMARY_CHARACTERS]
