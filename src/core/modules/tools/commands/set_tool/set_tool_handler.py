from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.managed_hooks import ManagedHooks
from core.modules.tools.commands.set_tool.set_tool import SetTool
from core.modules.tools.support.tool_card import ToolCard
from core.modules.tools.support.tool_catalogue import ToolCatalogue
from core.modules.tools.support.tools import Tools


class SetToolHandler(Handler[SetTool, ToolCard]):
    """Adds or removes the tool's managed hooks and records the changed file."""

    command = SetTool

    def __init__(self, tools: Tools, catalogue: ToolCatalogue, managed: ManagedHooks, events: EventLog) -> None:
        self.tools, self.catalogue, self.managed, self.events = tools, catalogue, managed, events

    def handle(self, command: SetTool, context: Context) -> ToolCard:
        card = self.tools.set_on(self.catalogue.find(command.name), command.is_on)
        self.events.write_file_change("tool.changed", self.managed.path, context)
        return card
