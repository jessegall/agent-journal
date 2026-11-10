from engine.driver.hook_event_name import HookEventName
from engine.journal.journal_home import JournalHome
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.providers import Providers
from core.modules.tools.support.tool_definition import ToolDefinition

HOOK_TIMEOUT_SECONDS = 20
EMPTY_SOURCE = ""


class ToolHooks:
    """The managed hooks a tool turned on holds: one per agent program, on its prompt event, calling the tool's
    tick. They live in the journal's managed hook file and no program's settings; the stamp in the command
    finds them again to turn the tool off."""

    def __init__(self, managed: ManagedHooks, providers: Providers, home: JournalHome) -> None:
        self.managed, self.providers, self.home = managed, providers, home

    def stamp(self, tool: ToolDefinition) -> str:
        return f"tool tick {tool.name} "

    def command(self, tool: ToolDefinition) -> str:
        return f'"{self.home.project_folder}/.journal/bin/journal" {self.stamp(tool)}--folder "$PWD"'

    def enabled(self, tool: ToolDefinition) -> bool:
        return any(self.stamp(tool) in hook.command for hook in self.managed.all())

    def add(self, tool: ToolDefinition) -> None:
        entry = {"type": "command", "command": self.command(tool), "timeout": HOOK_TIMEOUT_SECONDS}
        self.managed.added([ManagedHook.found(provider.name, event, "", entry, EMPTY_SOURCE, False)
                            for provider in self.providers.all() for event, name in provider.hook_events.items() if name is HookEventName.PROMPT])

    def remove(self, tool: ToolDefinition) -> None:
        self.managed.drop_stamped(self.stamp(tool))
