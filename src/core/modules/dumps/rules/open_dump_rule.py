from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.dumps.models.dump import Dump
from core.modules.dumps.support.dump_nudges import DUMP_OPEN


class OpenDumpRule(DriverRule):
    """When the main agent stops with a dump of its environment not filed, it is told what is left of the oldest one."""

    name = "dumps.open-dump"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        dumps = self.queries.query(Dump).filter(environment_id=hook.environment_id).matching(IsNull("closed_at")).oldest().page(1, 1).rows
        return RuleAnswer.with_nudges(DUMP_OPEN.nudge(dump=dumps[0].id)) if dumps else RuleAnswer.allowed()
