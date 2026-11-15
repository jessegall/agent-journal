from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.read_command_output_policy import ReadCommandOutputPolicy


class ReadCommandOutputRule(DriverRule):
    """The old walk's answer for ReadCommandOutputPolicy, which owns it, until the walk is deleted."""

    name = ReadCommandOutputPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Keeps the output of commands that count as reading in the agent's tool response"

    def __init__(self, policy: ReadCommandOutputPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
