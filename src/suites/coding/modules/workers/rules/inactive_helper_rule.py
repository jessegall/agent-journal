from suites.coding.modules.workers.support.worker_nudges import HELPER_INACTIVE
from suites.coding.modules.workers.support.worker_settings import QUIET_HELPER_MINUTES
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.settings.bindings.support.setting_values import SettingValues

MINUTE_SECONDS = 60
HELPER_ROLES = (AgentRole.WORKER, AgentRole.SUBAGENT)


class InactiveHelperRule(DriverRule):
    """A tick names to the main agent each worker and subagent of its own that has used no tool for the
    minutes the setting gives, again after the same minutes."""

    name = "workers.inactive-helper"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, calls: HookCallQuery, history: HookHistory, settings: SettingValues) -> None:
        self.queries, self.calls, self.hook_history, self.settings = queries, calls, history, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        minutes = self.settings.number(QUIET_HELPER_MINUTES, hook.environment_id)
        if self.hook_history.has_recent_answer(self.name, hook, minutes * MINUTE_SECONDS):
            return RuleAnswer.allowed()
        quiet = [helper for helper in self.helpers(hook.agent_id) if self.is_inactive(helper, hook, minutes)]
        return RuleAnswer.with_nudges(*(HELPER_INACTIVE.nudge(name=helper.role.value, agent=helper.id, minutes=minutes) for helper in quiet))

    def helpers(self, main_id: int) -> list[Agent]:
        return [helper for role in HELPER_ROLES for helper in self.queries.query(Agent).filter(parent_id=main_id, role=role).matching(IsNull("ended_at")).oldest().all_rows()]

    def is_inactive(self, helper: Agent, hook: AgentHook, minutes: int) -> bool:
        newest = self.calls.newest_agent_hook(helper.id)
        activity_at = newest.created_at if newest is not None else helper.created_at
        return activity_at is not None and activity_at.elapsed_seconds(hook.timestamp) >= minutes * MINUTE_SECONDS
