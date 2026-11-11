from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.drivers.support.driver_nudges import AGENT_COMPACTED
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole


class CompactionWakeRule(DriverRule):
    """A tick wakes an agent left sitting at its prompt by a compaction, since a /compact typed into its terminal
    does not start a new turn when it ends. It wakes the agent once: the compaction records the wake, whoever typed
    it."""

    name = "workers.compaction-wake"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]
    wakes_agent = True

    def __init__(self, hook_calls: HookCallQuery, compactions: ContextCompactions) -> None:
        self.hook_calls, self.compactions = hook_calls, compactions

    def answer(self, hook: AgentHook) -> RuleAnswer:
        latest = self.hook_calls.latest_turn_call(hook.agent_id)
        if latest is None or not latest.is_compaction_start or not self.hook_calls.is_idle(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        if self.compactions.is_woken(hook.agent_id):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(AGENT_COMPACTED.nudge()).running(WakeCompactedAgent(hook.agent_id))
