import re

from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.driver.tool_type import ToolType
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process


class OutputMonitored(BlockCondition):
    """The agent watches this output the way its program does, or the output has ended: it starts a Monitor naming
    the output, or, when its program has no Monitor tool, runs journal output monitor on it in its shell."""

    name = "output-monitored"

    def is_true(self, check: BlockCheck) -> bool:
        return self.is_watched(check) or check.container.get(Queries).query(Process).find(int(self.text)).state not in RUNNING_STATES

    def is_watched(self, check: BlockCheck) -> bool:
        tool = check.hook.event.tool
        monitor_tool = check.container.get(Providers).provider(check.hook.event.program).monitor_tool
        if tool is None or monitor_tool is None or tool.category != monitor_tool:
            return False
        if monitor_tool is ToolType.MONITOR:
            return re.search(rf"\b{self.text}\b", str(check.hook.event.tool_input().get("command", ""))) is not None
        return tool.shell is not None and tool.shell.has_part_running(f"journal output monitor {self.text}")
