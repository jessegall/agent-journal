from engine.event.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from engine.provider.managed_hooks import ManagedHooks
from core.modules.settings.support.setting_store import SettingStore
from core.modules.tools.commands.set_tool.set_tool import SetTool
from core.modules.tools.support.tool_card import ToolCard
from core.modules.tools.support.tool_catalogue import ToolCatalogue
from core.modules.tools.support.tools import Tools


class SetToolHandler(Handler[SetTool, ToolCard]):
    """Adds or removes the tool's managed hooks, switches the group of settings the tool declares with it, and
    records the changed file."""

    command = SetTool

    def __init__(self, tools: Tools, catalogue: ToolCatalogue, managed: ManagedHooks, events: EventLog, store: SettingStore) -> None:
        self.tools, self.catalogue, self.managed, self.events, self.store = tools, catalogue, managed, events, store

    def handle(self, command: SetTool, context: Context) -> ToolCard:
        tool = self.catalogue.find(command.name)
        card = self.tools.set_enabled(tool, command.enabled)
        if tool.settings is not None:
            self.store.write(tool.settings_key, command.enabled, None, context)
        self.events.write_file_change("tool.changed", self.managed.path, context)
        return card
