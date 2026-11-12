from pathlib import Path

from engine.event.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.tools.commands.refresh_tool.refresh_tool import RefreshTool
from core.modules.tools.support.tool_status import ToolStatus
from core.modules.tools.support.tools import Tools


class RefreshToolHandler(Handler[RefreshTool, ToolStatus]):
    """Starts the background refresh and returns where the tool's output stands; it records a change only when it
    started one."""

    command = RefreshTool

    def __init__(self, tools: Tools, events: EventLog) -> None:
        self.tools, self.events = tools, events

    def handle(self, command: RefreshTool, context: Context) -> ToolStatus:
        status = self.tools.tick(command.name, command.folder) if command.is_tick else self.tools.refresh(command.name, command.folder)
        if status.is_started and status.changed_path:
            self.events.write_file_change("tool.changed", Path(status.changed_path), context)
        return status
