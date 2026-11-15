from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.sleep_poll_policy import SleepPollPolicy


class SleepPollRule(DriverRule):
    """The old walk's answer for SleepPollPolicy, which owns it, until the walk is deleted."""

    name = SleepPollPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A line that only sleeps, sleeps in a loop to check again, or a sleep tool of the agent's program, is refused"

    def __init__(self, policy: SleepPollPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
