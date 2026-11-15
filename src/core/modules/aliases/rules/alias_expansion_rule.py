from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.aliases.policies.alias_expansion_policy import AliasExpansionPolicy


class AliasExpansionRule(DriverRule):
    """The old walk's answer for AliasExpansionPolicy, which owns it, until the walk is deleted."""

    name = AliasExpansionPolicy.key
    overlay_proof = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    essential = True
    single_action_refusal = "Checks expanded alias references and permissions before the shell line runs"

    def __init__(self, policy: AliasExpansionPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
