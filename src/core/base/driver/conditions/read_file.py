from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition


class ReadFile(BlockCondition):
    """The agent reads this file."""

    name = "read-file"

    def is_true(self, check: BlockCheck) -> bool:
        tool = check.hook.event.tool
        return tool is not None and tool.is_readonly and any(path.endswith(self.text) for path in tool.files)
