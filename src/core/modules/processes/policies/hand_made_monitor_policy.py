from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.enums.tool_type import ToolType
from engine.provider.providers import Providers
from core.modules.processes.support.output_watch_call import MONITOR_LINE
from core.modules.processes.nudges.hand_made_monitor_nudge import HandMadeMonitorNudge
from core.modules.processes.nudges.monitor_tool_required_nudge import MonitorToolRequiredNudge

OUTPUT_LINE = "journal output "


class HandMadeMonitorPolicy(EventPolicy):
    """A Monitor that loops over an output by hand is refused: its match can miss the end of the run, and the
    command made for it cannot. Where the program has a Monitor tool, that command runs only in it: as a plain
    command it blocks the agent. A program with no Monitor tool runs it in its shell, which is how it watches."""

    key = "processes.hand-made-monitor"
    rank = "shell.all"

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        tool = event.tool
        if self.providers.provider(event.program).monitor_tool is not ToolType.MONITOR:
            return None
        if tool is not None and tool.shell is not None and any(part.text.startswith(MONITOR_LINE) for part in tool.shell.parts):
            return MonitorToolRequiredNudge.declared().nudge()
        if tool is None or tool.category != ToolType.MONITOR:
            return None
        command = str(event.tool_input().get("command", ""))
        if OUTPUT_LINE in command and MONITOR_LINE not in command:
            return HandMadeMonitorNudge.declared().nudge()
        return None
