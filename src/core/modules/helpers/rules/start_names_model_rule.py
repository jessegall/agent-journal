from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.helpers.policies.start_names_model_policy import StartNamesModelPolicy


class StartNamesModelRule(DriverRule):
    """The old walk's answer for StartNamesModelPolicy, which owns it, until the walk is deleted."""

    name = StartNamesModelPolicy.key
    single_action_refusal = "A helper start that names no model is refused, naming the flag"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, policy: StartNamesModelPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
