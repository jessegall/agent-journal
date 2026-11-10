from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.commands.wake_inactive_agent.wake_inactive_agent import WakeInactiveAgent
from core.modules.drivers.models.agent_activity import AgentActivity
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.driver_nudges import CACHE_KEEPALIVE
from core.modules.helpers.support.helper_settings import COLD_SESSION_MINUTES
from core.modules.processes.support.output_check_schedule import MINUTE_SECONDS
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.agent_role import AgentRole

RETRY_SECONDS = Seconds(600)


class CacheRefreshRule(DriverRule):
    """A tick wakes an idle main agent with a short line once its prompt cache has lasted the cold session
    minutes since its last hook, so the cache never expires and the agent does not pay to write its context
    again; the line asks for no work and the agent stops again at once. At 0 minutes the rule is off."""

    name = "workers.cache-keepalive"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, hook_history: HookHistory, hook_calls: HookCallQuery, queries: Queries, settings: SettingValues) -> None:
        self.hook_history, self.hook_calls, self.queries, self.settings = hook_history, hook_calls, queries, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        minutes = self.settings.number(COLD_SESSION_MINUTES)
        if not minutes:
            return RuleAnswer.allowed()
        latest = self.hook_calls.latest_turn_call(hook.agent_id)
        if latest is None or latest.hook != HookEventName.STOP or latest.answer != HookAnswer.ALLOWED:
            return RuleAnswer.allowed()
        if not self.queries.query(AgentActivity).find(hook.agent_id).is_inactive(hook.timestamp, minutes * MINUTE_SECONDS):
            return RuleAnswer.allowed()
        if self.hook_history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CACHE_KEEPALIVE.nudge()).running(WakeInactiveAgent(hook.agent_id))
