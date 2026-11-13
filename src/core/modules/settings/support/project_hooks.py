from pathlib import Path

from engine.driver.driver_rule import DriverRule
from engine.journal.journal_home import JournalHome
from engine.provider.hook_manager import HookManager
from engine.provider.managed_hook_history_reader import ManagedHookHistoryReader
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from engine.provider.provider import Provider
from engine.provider.providers import Providers
from engine.provider.program_settings_sync import ProgramSettingsSync
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.types.type_guards import is_list, is_mapping
from core.modules.settings.support.journal_hook import JournalHook
from core.modules.settings.support.managed_hook_item import ManagedHookItem
from core.modules.settings.support.project_hook_list import ProjectHookList
from core.modules.settings.support.unmanaged_hook import UnmanagedHook


TRACKED_REASON = "This hook is in a tracked project file and still runs in journal launches."
JOURNAL_FILE_REASON = "Written by the journal at every start and read-only; changes are put back."


class ProjectHooks:
    """Reads managed hooks, pending native commands and files left outside management."""

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, history: ManagedHookHistoryReader, sync: ProgramSettingsSync,
                 backup: ProgramSettingsBackup) -> None:
        self.home, self.providers, self.managed, self.history, self.sync, self.backup = home, providers, managed, history, sync, backup

    def listed(self) -> ProjectHookList:
        root = self.home.project_folder
        providers = self.providers.all()
        rules = [entry.path.checked_class(DriverRule) for entry in self.providers.registry.rules]
        manager = HookManager(root, self.managed, rules)
        return ProjectHookList(tuple(ManagedHookItem(hook, self.history.read(hook)) for hook in self.managed.all()),
                               tuple(entry for provider in providers for entry in self.journal_entries(provider)),
                               tuple(hook for provider in providers for hook in manager.unmanaged(type(provider), root)),
                               tuple(entry for provider in providers for entry in (*self.excluded(provider), *self.tracked(provider, manager), *self.journal_files(provider))),
                               self.sync.uses_shell_runner or any(ProgramHooks.hooks(type(provider), root).uses_shell_runner for provider in providers))

    def journal_entries(self, provider: Provider) -> list[JournalHook]:
        root = self.home.project_folder
        hook_file = provider.journal_hook_file(self.home)
        program_hooks = ProgramHooks.journal(type(provider), hook_file)
        stored = ProgramHooks.partitioned(program_hooks.settings().get("hooks")).journal
        managed = self.managed.all()
        return [JournalHook(provider.name, event, str(hook_file.resolve().relative_to(root)), program_hooks.entry_timeout(event, managed)) for event in stored]

    def excluded(self, provider: Provider) -> list[UnmanagedHook]:
        native = [entry for name in provider.hook_files for entry in self.excluded_file(provider.name, name)]
        user_files = [UnmanagedHook(provider.name, str(path), None, self.person_file_reason(provider, path)) for path in provider.user_hook_files() if path.is_file()]
        return [*native, *user_files]

    def person_file_reason(self, provider: Provider, path: Path) -> str:
        newest = self.backup.newest(provider.name, path.name)
        stamp = newest.name.split("-", 1)[0] if newest is not None else ""
        backed_raised = f"backed up at {newest} ({stamp})." if newest is not None else "it is backed up at the next start."
        program_note = f" {provider.person_file_note}" if provider.person_file_note and path == provider.user_hook_files()[0] else ""
        return f"Not read by journal launches; {backed_raised}{program_note}"

    def tracked(self, provider: Provider, manager: HookManager) -> list[UnmanagedHook]:
        root = self.home.project_folder
        return [UnmanagedHook(provider.name, hook.source, hook.event, TRACKED_REASON) for hook in manager.unmanaged(type(provider), root) if hook.tracked]

    def journal_files(self, provider: Provider) -> list[UnmanagedHook]:
        root = self.home.project_folder
        return [UnmanagedHook(provider.name, str(file.path.resolve().relative_to(root)), None, JOURNAL_FILE_REASON) for file in self.sync.provider_settings(provider).files]

    def excluded_file(self, program: str, name: Path) -> list[UnmanagedHook]:
        kept = ProgramHooks.partitioned(ProgramHooks.read(self.home.project_folder / name).get("hooks")).kept
        return [entry for event, blocks in kept.items() for block in blocks for entry in self.excluded_block(program, str(name), event, block)]

    @staticmethod
    def excluded_block(program: str, source: str, event: str, block: object) -> list[UnmanagedHook]:
        if not is_mapping(block) or not is_list(entries := block.get("hooks")):
            return []
        return [UnmanagedHook(program, source, event, "This entry is not a command.") for entry in entries if not ProgramHooks.is_journals(entry)]
