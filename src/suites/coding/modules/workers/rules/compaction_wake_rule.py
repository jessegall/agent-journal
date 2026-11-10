from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.driver_nudges import AGENT_COMPACTED
from suites.coding.support.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole

RETRY_SECONDS = Seconds(600)


class CompactionWakeRule(DriverRule):
    """A tick wakes an agent left sitting at its prompt by a compaction, since a /compact typed into its terminal
    does not start a new turn when it ends."""

    name = "workers.compaction-wake"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]
    wakes_agent = True

    def __init__(self, hook_history: HookHistory, hook_calls: HookCallQuery) -> None:
        self.hook_history, self.hook_calls = hook_history, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        latest = self.hook_calls.latest_turn_call(hook.agent_id)
        if latest is None or not latest.is_compaction_start or not self.hook_calls.is_idle(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        if self.hook_history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(AGENT_COMPACTED.nudge()).running(WakeCompactedAgent(hook.agent_id))
