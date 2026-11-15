from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.policies.type_commands_policy import TypeCommandsPolicy


class TypeCommandsRule(DriverRule):
    """The old walk's answer for TypeCommandsPolicy, which owns it, until the walk is deleted."""

    name = TypeCommandsPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A helper runs only the shell command types and the journal lines its type lists"

    def __init__(self, policy: TypeCommandsPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        refusal = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(refusal) if refusal is not None else RuleAnswer.allowed()
