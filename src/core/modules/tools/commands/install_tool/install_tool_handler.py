from core.base.change.event_log import EventLog
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.provider.managed_hooks import ManagedHooks
from core.modules.settings.commands.scan_managed_hooks.scan_managed_hooks import ScanManagedHooks
from core.modules.tools.commands.install_tool.install_tool import InstallTool
from core.modules.tools.support.tool_card import ToolCard
from core.modules.tools.support.tool_catalogue import ToolCatalogue
from core.modules.tools.support.tools import Tools


class InstallToolHandler(Handler[InstallTool, ToolCard]):
    """Runs the tool's install command, takes the hooks it wrote under the journal's management and records
    the change."""

    command = InstallTool
    runs_once = True

    def __init__(self, tools: Tools, catalogue: ToolCatalogue, managed: ManagedHooks, events: EventLog, bus: Bus) -> None:
        self.tools, self.catalogue, self.managed, self.events, self.bus = tools, catalogue, managed, events, bus

    def handle(self, command: InstallTool, context: Context) -> ToolCard:
        card = self.tools.install(self.catalogue.find(command.name))
        self.bus.run_with_context(ScanManagedHooks(), context)
        self.events.write_file_change("tool.changed", self.managed.path, context)
        return card
