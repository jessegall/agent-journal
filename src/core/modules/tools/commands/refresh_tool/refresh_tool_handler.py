from pathlib import Path

from engine.event.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from engine.journal.journal_home import JournalHome
from core.modules.tools.commands.refresh_tool.refresh_tool import RefreshTool
from core.modules.tools.support.graph.graph_files import GraphFiles
from core.modules.tools.support.graph.graph_status import GraphStatus
from core.modules.tools.support.tool_catalogue import ToolCatalogue
from core.modules.tools.support.tools import Tools


class RefreshToolHandler(Handler[RefreshTool, GraphStatus]):
    """Starts the background refresh and returns where the graph stands; it records a change only when it
    started one."""

    command = RefreshTool

    def __init__(self, tools: Tools, catalogue: ToolCatalogue, events: EventLog, home: JournalHome) -> None:
        self.tools, self.catalogue, self.events, self.home = tools, catalogue, events, home

    def handle(self, command: RefreshTool, context: Context) -> GraphStatus:
        self.catalogue.find(command.name)
        status = self.tools.tick(command.folder) if command.is_tick else self.tools.refresh(command.folder)
        if status.is_started:
            self.events.write_file_change("tool.changed", GraphFiles(Path(command.folder) if command.folder else self.home.project_folder).running_path, context)
        return status
