from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.driver_rule import DriverRule
from core.base.journal_home import JournalHome
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.providers import Providers
from core.base.provider.hook_manager import HookManager
from core.modules.settings.commands.scan_managed_hooks.scan_managed_hooks import ScanManagedHooks


class ScanManagedHooksHandler(Handler[ScanManagedHooks, int]):
    """Imports each program's native hooks and records the completed scan."""

    command = ScanManagedHooks

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, events: EventLog) -> None:
        self.home, self.providers, self.managed, self.events = home, providers, managed, events

    def handle(self, command: ScanManagedHooks, context: Context) -> int:
        rules = [entry.path.checked_class(DriverRule) for entry in self.providers.registry.rules]
        manager = HookManager(self.home.project_folder, self.managed, rules)
        for provider in self.providers.all():
            manager.import_hooks(type(provider), self.home.project_folder)
        self.events.write_file_change("managed-hook.scanned", self.managed.path, context)
        return len(self.managed.all())
