from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.retry_loop_policy import RetryLoopPolicy


class RetryLoopRule(DriverRule):
    """The old walk's answer for RetryLoopPolicy, which owns it, until the walk is deleted."""

    name = RetryLoopPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Refuses a shell line that runs something again until it works"

    def __init__(self, policy: RetryLoopPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
