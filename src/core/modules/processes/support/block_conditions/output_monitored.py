import re

from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.driver.tool_type import ToolType
from core.base.query.queries import Queries
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process


class OutputMonitored(BlockCondition):
    """The agent starts a Monitor naming this output, or the output has ended."""

    name = "output-monitored"

    def is_true(self, check: BlockCheck) -> bool:
        tool = check.hook.event.tool
        if tool is not None and tool.category == ToolType.MONITOR and re.search(rf"\b{self.text}\b", str(check.hook.event.tool_input().get("command", ""))):
            return True
        return check.container.get(Queries).query(Process).find(int(self.text)).state not in RUNNING_STATES
