from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool import Tool

WRITING_CATEGORIES = ("edit", "write")
WRITING_EFFECT = "writes_files"


class ReadsOnlyLimit(DriverRule):
    """A subagent reads and searches only: an edit, a write or a shell line that writes files is refused, under
    every overlay."""

    name = "coding.subagent-reads-only"
    hook = "pre_tool_use"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        return RuleAnswer.refused("a subagent reads and searches only: the agent that sent it makes the change") if tool is not None and self.writes(tool) else RuleAnswer.allowed()

    @staticmethod
    def writes(tool: Tool) -> bool:
        if tool.category in WRITING_CATEGORIES:
            return True
        return tool.shell is not None and (bool(tool.shell.redirects) or any(WRITING_EFFECT in part.classification.effects for part in tool.shell.parts))
