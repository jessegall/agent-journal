from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.managed_hooks import ManagedHooks
from core.modules.tools.commands.install_tool.install_tool import InstallTool
from core.modules.tools.support.tool_card import ToolCard
from core.modules.tools.support.tool_catalogue import ToolCatalogue
from core.modules.tools.support.tools import Tools


class InstallToolHandler(Handler[InstallTool, ToolCard]):
    """Runs the tool's install command and records the change."""

    command = InstallTool
    runs_once = True

    def __init__(self, tools: Tools, catalogue: ToolCatalogue, managed: ManagedHooks, events: EventLog) -> None:
        self.tools, self.catalogue, self.managed, self.events = tools, catalogue, managed, events

    def handle(self, command: InstallTool, context: Context) -> ToolCard:
        card = self.tools.install(self.catalogue.find(command.name))
        self.events.write_file_change("tool.changed", self.managed.path, context)
        return card
