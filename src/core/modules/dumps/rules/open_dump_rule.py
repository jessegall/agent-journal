from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.support.dump_nudges import DUMP_OPEN


class OpenDumpRule(DriverRule):
    """Reminds the main agent of the oldest unfinished project dump after a tool call."""

    name = "dumps.open-dump"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        dump = self.queries.query(Dump).matching(IsNull("closed_at")).oldest().first()
        return RuleAnswer.with_nudges(DUMP_OPEN.nudge(dump=dump.id)) if dump is not None else RuleAnswer.allowed()
