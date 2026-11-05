from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition


class RanCommand(BlockCondition):
    """The agent runs this command, as a whole part of its line: journal output title 1 is not journal output
    title 12, and (journal overview) in a subshell or journal overview; ls is the command."""

    name = "ran-command"

    def is_true(self, check: BlockCheck) -> bool:
        tool = check.hook.event.tool
        return tool is not None and tool.shell is not None and tool.shell.has_part_running(self.text)
