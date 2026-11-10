import re

from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.driver.tool_type import ToolType
from core.base.provider.providers import Providers
from engine.query.conditions.contains_some import ContainsSome
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.base.driver.hook_event_name import HookEventName
from core.modules.processes.support.monitored_runs import MONITOR_LIFE_SECONDS, MONITOR_TOOL
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process


class OutputMonitored(BlockCondition):
    """The agent watches this output the way its program does, or the output has ended: it starts a Monitor
    naming the output, or, when its program has no Monitor tool, runs journal output monitor on it in its
    shell."""

    name = "output-monitored"

    def is_true(self, check: BlockCheck) -> bool:
        process = check.container.get(Queries).query(Process).find(int(self.text))
        return self.is_watched(check) or process.state not in RUNNING_STATES or self.has_active_monitor(check, process)

    def has_active_monitor(self, check: BlockCheck, process: Process) -> bool:
        calls = check.container.get(Queries).query(HookCall).filter(session_agent_id=check.hook.agent_id, hook=HookEventName.PRE_TOOL_USE, tool=MONITOR_TOOL,
                                                                  answer=HookAnswer.ALLOWED).matching(Minimum("created_at", process.creation_timestamp().text)).matching(ContainsSome(["summary"], [self.text])).all_rows()
        return any(re.search(rf"\b{self.text}\b", call.summary) is not None and call.creation_timestamp().elapsed_seconds(check.hook.timestamp) < MONITOR_LIFE_SECONDS for call in calls)

    def is_watched(self, check: BlockCheck) -> bool:
        tool = check.hook.event.tool
        monitor_tool = check.container.get(Providers).provider(check.hook.event.program).monitor_tool
        if tool is None or monitor_tool is None or tool.category != monitor_tool:
            return False
        if monitor_tool is ToolType.MONITOR:
            return re.search(rf"\b{self.text}\b", str(check.hook.event.tool_input().get("command", ""))) is not None
        return tool.shell is not None and tool.shell.has_part_running(f"journal output monitor {self.text}")
