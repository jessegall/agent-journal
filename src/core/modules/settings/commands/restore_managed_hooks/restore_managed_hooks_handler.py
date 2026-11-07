from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.journal_home import JournalHome
from core.base.provider.hook_manager import HookManager
from core.base.provider.managed_hooks import ManagedHooks
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
