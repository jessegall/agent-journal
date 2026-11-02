from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.driver_nudges import PAUSED_REFUSAL


class PausedAgentRule(DriverRule):
    """A paused agent's tool calls are refused until it is resumed, except journal lines, read tools and read
    commands, so it can still look things up and answer in the chat."""

    name = "drivers.paused-agent"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and (tool.is_journal_line or tool.is_reading):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(PAUSED_REFUSAL.nudge())
