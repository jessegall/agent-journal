from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition


class RanCommand(BlockCondition):
    """The agent runs this command."""

    name = "ran-command"

    def is_true(self, check: BlockCheck) -> bool:
        tool = check.hook.event.tool
        return tool is not None and tool.shell is not None and self.text in tool.shell.line
