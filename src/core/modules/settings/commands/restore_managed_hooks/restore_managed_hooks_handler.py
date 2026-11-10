from engine.change.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from engine.journal.journal_home import JournalHome
from engine.provider.hook_manager import HookManager
from engine.provider.managed_hooks import ManagedHooks
from core.modules.settings.commands.restore_managed_hooks.restore_managed_hooks import RestoreManagedHooks


class RestoreManagedHooksHandler(Handler[RestoreManagedHooks, int]):
    """Returns hooks through the shared manager and records the change."""

    command = RestoreManagedHooks

    def __init__(self, home: JournalHome, managed: ManagedHooks, events: EventLog) -> None:
        self.home, self.managed, self.events = home, managed, events

    def handle(self, command: RestoreManagedHooks, context: Context) -> int:
        restored = len(HookManager(self.home.project_folder, self.managed).restore())
        self.events.write_file_change("managed-hook.restored", self.managed.path, context)
        return restored
