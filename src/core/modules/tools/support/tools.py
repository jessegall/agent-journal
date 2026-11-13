from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.modules.tools.support.tool_card import ToolCard
from core.modules.tools.support.tool_catalogue import ToolCatalogue
from core.modules.tools.support.tool_definition import ToolDefinition
from core.modules.tools.support.tool_hooks import ToolHooks
from core.modules.tools.support.tool_status import ToolStatus


class Tools:
    """What the commands and the Tools page do with the supported tools: a card of each, turning one on or off
    through its managed hooks, installing it and refreshing its output, each through the runner its suite
    binds."""

    def __init__(self, catalogue: ToolCatalogue, hooks: ToolHooks, home: JournalHome) -> None:
        self.catalogue, self.hooks, self.home = catalogue, hooks, home

    def cards(self) -> list[ToolCard]:
        return [self.card(tool) for tool in self.catalogue.all()]

    def card(self, tool: ToolDefinition) -> ToolCard:
        runner = self.catalogue.runner(tool.name)
        status = runner.status(self.home.project_folder)
        return ToolCard(tool.name, tool.title, tool.description, runner.is_installed(), self.hooks.enabled(tool), status.is_running,
                        runner.is_failed(self.home.project_folder), status.refreshed_at, status.graph_commit)

    def set_enabled(self, tool: ToolDefinition, enabled: bool) -> ToolCard:
        if enabled:
            self.hooks.add(tool)
        else:
            self.hooks.remove(tool)
        return self.card(tool)

    def install(self, tool: ToolDefinition) -> ToolCard:
        self.catalogue.runner(tool.name).install(self.home.project_folder)
        return self.card(tool)

    def refresh(self, name: str, folder: str) -> ToolStatus:
        return self.catalogue.runner(name).refresh(Path(folder) if folder else self.home.project_folder)

    def tick(self, name: str, folder: str) -> ToolStatus:
        return self.catalogue.runner(name).tick(Path(folder) if folder else self.home.project_folder)

    # Copies into a new checkout what each tool that is on needs of its output, and names the folders written.
    def worktree_outputs(self, source: str, folder: str) -> list[str]:
        if not Path(folder).is_dir():
            return []
        return [name for tool in self.catalogue.all() if self.hooks.enabled(tool) for name in self.catalogue.runner(tool.name).copy_output(Path(source), Path(folder))]
