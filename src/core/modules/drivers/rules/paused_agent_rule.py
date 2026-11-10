from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.driver_nudges import PAUSED_REFUSAL
from core.modules.drivers.support.block_conditions.agent_resumed import AgentResumed


class PausedAgentRule(DriverRule):
    """A paused agent's tool calls are refused until it is resumed, except journal lines, read tools and read
    commands, so it can still look things up and answer in the chat."""

    name = "drivers.paused-agent"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.blocked(hook, PAUSED_REFUSAL.nudge(), AgentResumed())
