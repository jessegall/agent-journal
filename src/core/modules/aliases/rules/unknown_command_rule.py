from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.aliases.policies.unknown_command_policy import UnknownCommandPolicy


class UnknownCommandRule(DriverRule):
    """The old walk's answer for UnknownCommandPolicy, which owns it, until the walk is deleted."""

    name = UnknownCommandPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A command of a type the journal does not know is refused until its leading words are classified"

    def __init__(self, policy: UnknownCommandPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        refusal = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(refusal) if refusal is not None else RuleAnswer.allowed()
