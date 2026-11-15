from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.policies.checkout_write_code_policy import CheckoutWriteCodePolicy


class CheckoutWriteCodeRule(DriverRule):
    """The old walk's answer for CheckoutWriteCodePolicy, which owns it, until the walk is deleted."""

    name = CheckoutWriteCodePolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "While the main agent writes no code, it writes no file of the project checkout, by a file tool or a shell"

    def __init__(self, policy: CheckoutWriteCodePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        refusal = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(refusal) if refusal is not None else RuleAnswer.allowed()
