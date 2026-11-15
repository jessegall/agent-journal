from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.sequences.policies.step_guard_policy import StepGuardPolicy


class StepGuardRule(DriverRule):
    """The old walk's answer for StepGuardPolicy, which owns it, until the walk is deleted."""

    name = StepGuardPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A step that holds file edits refuses a writing call, except journal lines and the commands the step allows"

    def __init__(self, policy: StepGuardPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
