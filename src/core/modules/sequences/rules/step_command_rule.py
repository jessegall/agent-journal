from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.sequences.policies.step_command_policy import StepCommandPolicy


class StepCommandRule(DriverRule):
    """The old walk's answer for StepCommandPolicy, which owns it, until the walk is deleted."""

    name = StepCommandPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A step refuses the journal commands it lists, also in a chain or inside a shell of their own"

    def __init__(self, policy: StepCommandPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
