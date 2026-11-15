from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.plugins.policies.plugin_program_policy import PluginProgramPolicy


class PluginProgramRule(DriverRule):
    """The old walk's answer for PluginProgramPolicy, which owns it, until the walk is deleted."""

    name = PluginProgramPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Refuses a shell line that runs a program from the folder of a plugin that is switched off or no longer"

    def __init__(self, policy: PluginProgramPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
