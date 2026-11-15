from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.policies.panic_file_policy import PanicFilePolicy


class PanicFileRule(DriverRule):
    """The old walk's answer for PanicFilePolicy, which owns it, until the walk is deleted."""

    name = PanicFilePolicy.key
    overlay_proof = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "An agent may write the panic file only after hooks went through unchecked because the server did not answer"

    def __init__(self, policy: PanicFilePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
