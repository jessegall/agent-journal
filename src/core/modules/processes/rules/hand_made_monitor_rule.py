from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.hand_made_monitor_policy import HandMadeMonitorPolicy


class HandMadeMonitorRule(DriverRule):
    """The old walk's answer for HandMadeMonitorPolicy, which owns it, until the walk is deleted."""

    name = HandMadeMonitorPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "A Monitor that loops over an output by hand is refused"

    def __init__(self, policy: HandMadeMonitorPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
