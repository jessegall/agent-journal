from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.claude_code.policies.native_memory_policy import NativeMemoryPolicy


class NativeMemoryRule(DriverRule):
    """The old walk's answer for NativeMemoryPolicy, which owns it, until the walk is deleted."""

    name = NativeMemoryPolicy.key
    exempt = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A write into Claude Code's own memory folder is refused, under every overlay"

    def __init__(self, policy: NativeMemoryPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
