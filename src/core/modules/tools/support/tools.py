from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.tools.support.graph_files import OUTPUT_FOLDER
from core.modules.tools.support.graph_status import GraphStatus
from core.modules.tools.support.graphify_tool import GraphifyTool
from core.modules.tools.support.tool_card import ToolCard
from core.modules.tools.support.tool_catalogue import ToolCatalogue
from core.modules.tools.support.tool_definition import ToolDefinition
from core.modules.tools.support.tool_hooks import ToolHooks


class Tools:
    """What the commands and the Tools page do with the supported tools: a card of each, turning one on or off
    through its managed hooks, installing it and refreshing its graph."""

    def __init__(self, catalogue: ToolCatalogue, hooks: ToolHooks, graphify: GraphifyTool, home: JournalHome) -> None:
        self.catalogue, self.hooks, self.graphify, self.home = catalogue, hooks, graphify, home

    def cards(self) -> list[ToolCard]:
        return [self.card(tool) for tool in self.catalogue.all()]

    def card(self, tool: ToolDefinition) -> ToolCard:
        status = self.graphify.status(self.home.project_folder)
        return ToolCard(tool.name, tool.title, tool.description, self.graphify.is_installed(), self.hooks.is_on(tool), status.is_running,
                        self.graphify.is_failed(self.home.project_folder), status.refreshed_at, status.graph_commit)

    def set_on(self, tool: ToolDefinition, is_on: bool) -> ToolCard:
        if is_on:
            self.hooks.add(tool)
        else:
            self.hooks.remove(tool)
        return self.card(tool)

    def install(self, tool: ToolDefinition) -> ToolCard:
        self.graphify.install()
        return self.card(tool)

    def refresh(self, folder: str) -> GraphStatus:
        return self.graphify.refresh(Path(folder) if folder else self.home.project_folder)

    def tick(self, folder: str) -> GraphStatus:
        return self.graphify.tick(Path(folder) if folder else self.home.project_folder)

    def worktree_graph(self, source: str, folder: str) -> list[str]:
        """Gives a new worktree a copy of the source checkout's graph when a tool keeps one, and names what git
        must leave out; the worktree's own commits refresh it after that."""
        if not any(self.hooks.is_on(tool) for tool in self.catalogue.all()):
            return []
        self.graphify.copy_graph(Path(source), Path(folder))
        return [OUTPUT_FOLDER]
