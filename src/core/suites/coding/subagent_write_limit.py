from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer


class SubagentWriteLimit(DriverRule):
    """A subagent reads and searches only: an edit, a write or a shell line that writes files is refused, under
    every overlay."""

    name = "coding.subagent-reads-only"
    hook = "pre_tool_use"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.is_writing_files():
            return RuleAnswer.refused("a subagent reads and searches only: the agent that sent it makes the change")
        return RuleAnswer.allowed()
