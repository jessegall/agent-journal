from pathlib import PurePath

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.messages.support.message_nudges import PLAIN_CODE_NUDGE

CODE_SUFFIXES = (".py", ".js", ".ts", ".vue", ".go", ".php")


class PlainCodeRule(DriverRule):
    """An edit of a code file reminds the agent, every half hour, to write code in plain words."""

    name = "messages.plain-code"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.is_writing_files() or not any(PurePath(path).suffix in CODE_SUFFIXES for path in tool.files):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(PLAIN_CODE_NUDGE.nudge())
