from engine.driver.agent_hook import AgentHook
from engine.enums.tool_type import ToolType
from engine.provider.providers import Providers

MONITOR_LINE = "journal output monitor "


class OutputWatchCall:
    """Says whether a tool call only starts the watch of an output: the Monitor tool running the journal's own
    watch command, or that command in the shell of a program that has no Monitor tool."""

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def is_watch(self, hook: AgentHook) -> bool:
        tool = hook.event.tool
        monitor_tool = self.providers.provider(hook.event.program).monitor_tool
        if tool is None or monitor_tool is None or tool.category != monitor_tool:
            return False
        if monitor_tool is ToolType.MONITOR:
            return str(hook.event.tool_input().get("command", "")).strip().startswith(MONITOR_LINE)
        return tool.shell is not None and all(part.text.startswith(MONITOR_LINE) for part in tool.shell.parts)
