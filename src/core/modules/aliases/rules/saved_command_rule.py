from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.aliases.policies.saved_command_policy import SavedCommandPolicy


class SavedCommandRule(DriverRule):
    """The old walk's answer for SavedCommandPolicy, which owns it, until the walk is deleted."""

    name = SavedCommandPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Requires tests and builds to use saved commands with valid reading and timeout options"

    def __init__(self, policy: SavedCommandPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        refusal = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(refusal) if refusal is not None else RuleAnswer.allowed()
