from datetime import timedelta

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.agent_role import AgentRole
from core.base.role_group import RoleGroup
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery

START_LIMIT = timedelta(seconds=60)


class UnstartedHelperRule(DriverRule):
    """On its parent's tick, records a failed launch for a helper that sent no hook a minute after it started."""

    name = "helpers.unstarted-helper"
    hook = HookEventName.TICK
    drivers = ["*"]
    role_group = RoleGroup.ANY
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, hook_calls: HookCallQuery) -> None:
        self.queries, self.hook_calls = queries, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        helpers = self.queries.query(Agent).filter(parent_id=hook.agent_id, role=AgentRole.HELPER).matching(IsNull("ended_at")).all_rows()
        silent = (helper for helper in helpers if self.is_silent(helper, hook))
        return RuleAnswer.allowed().running(*(RecordAgentLaunchFailure(helper.id) for helper in silent))

    def is_silent(self, helper: Agent, hook: AgentHook) -> bool:
        started = helper.creation_timestamp().value + START_LIMIT < hook.timestamp.value
        return started and self.hook_calls.newest_agent_hook(helper.id) is None
