from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.equal import Equal
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.driver_nudges import TAKEOVER


class TakeoverRule(DriverRule):
    """A new main session in an environment that had another is told the chat above it is history; a session
    that has hooks already, after a compaction or a resume, is the same agent and is told nothing."""

    name = "drivers.takeover"
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, hook_calls: HookCallQuery) -> None:
        self.queries, self.hook_calls = queries, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.hook_calls.newest_agent_hook(hook.agent_id) is not None:
            return RuleAnswer.allowed()
        remaining = self.queries.query(Agent).filter(role=AgentRole.MAIN).matching(Equal("id", hook.agent_id, negated=True))
        newest = remaining.newest().first()
        return RuleAnswer.with_nudges(TAKEOVER.nudge(agent=newest.id)) if newest is not None else RuleAnswer.allowed()
