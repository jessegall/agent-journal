from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.interval import Interval
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.span_queries import SpanQueries
from core.base.helper_role import HelperRole
from core.base.role_group import RoleGroup
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.support.helper_settings import UNSTARTED_HELPER_SECONDS
from core.modules.settings.bindings.support.setting_values import SettingValues


class UnstartedHelperRule(DriverRule):
    """On its parent's tick, records a failed launch for a helper that sent no hook within the unstarted helper seconds of its start."""

    name = "helpers.unstarted-helper"
    hook = HookEventName.TICK
    drivers = ["*"]
    role_group = RoleGroup.ANY
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, hook_calls: HookCallQuery, settings: SettingValues, spans: SpanQueries) -> None:
        self.agents, self.hook_calls, self.settings, self.spans = agents, hook_calls, settings, spans

    def answer(self, hook: AgentHook) -> RuleAnswer:
        helpers = self.agents.running(HelperRole.HELPER, hook.agent_id)
        limit = Interval(self.settings.seconds(UNSTARTED_HELPER_SECONDS))
        silent = (helper for helper in helpers if self.is_silent(helper, hook, limit))
        return RuleAnswer.allowed().running(*(RecordAgentLaunchFailure(helper.id) for helper in silent))

    def is_silent(self, helper: Agent, hook: AgentHook, limit: Interval) -> bool:
        started = limit.has_passed(self.spans, hook.agent_id, helper.creation_timestamp(), hook.timestamp)
        return started and self.hook_calls.newest_agent_hook(helper.id) is None
