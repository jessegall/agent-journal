from pathlib import Path

from core.base.driver.driver_rule import DriverRule
from core.base.journal_home import JournalHome
from core.base.provider.hook_manager import HookManager
from core.base.provider.managed_hook_history_reader import ManagedHookHistoryReader
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from core.base.provider.provider import Provider
from core.base.provider.providers import Providers
from core.base.type_guards import is_list, is_mapping
from core.modules.settings.support.journal_hook import JournalHook
from core.modules.settings.support.managed_hook_item import ManagedHookItem
from core.modules.settings.support.project_hook_list import ProjectHookList
from core.modules.settings.support.unmanaged_hook import UnmanagedHook


class ProjectHooks:
    """Reads managed hooks, pending native commands and files left outside management."""

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, history: ManagedHookHistoryReader) -> None:
        self.home, self.providers, self.managed, self.history = home, providers, managed, history

    def listed(self) -> ProjectHookList:
        root = self.home.project_folder
        providers = self.providers.all()
        rules = [entry.path.checked_class(DriverRule) for entry in self.providers.registry.rules]
        manager = HookManager(root, self.managed, rules)
        return ProjectHookList(tuple(ManagedHookItem(hook, self.history.read(hook)) for hook in self.managed.all()),
                               tuple(entry for provider in providers for entry in self.journal_entries(provider)),
                               tuple(hook for provider in providers for hook in manager.unmanaged(type(provider), root)),
                               tuple(entry for provider in providers for entry in self.excluded(provider)),
                               any(ProgramHooks.hooks(type(provider), root).uses_shell_runner for provider in providers))

    def journal_entries(self, provider: Provider) -> list[JournalHook]:
        program_hooks = ProgramHooks.hooks(type(provider), self.home.project_folder)
        written = ProgramHooks.partitioned(program_hooks.settings().get("hooks")).journal
        managed = self.managed.all()
        return [JournalHook(provider.name, event, str(provider.hook_file.path), program_hooks.entry_timeout(event, managed)) for event in written]

    def excluded(self, provider: Provider) -> list[UnmanagedHook]:
        native = [entry for name in provider.hook_files for entry in self.excluded_file(provider.name, name)]
        user_files = [UnmanagedHook(provider.name, str(path), None, "User-level files are listed without changes.")
                      for path in provider.user_hook_files() if path.is_file()]
        return [*native, *user_files]

    def excluded_file(self, program: str, name: Path) -> list[UnmanagedHook]:
        kept = ProgramHooks.partitioned(ProgramHooks.read(self.home.project_folder / name).get("hooks")).kept
        return [entry for event, blocks in kept.items() for block in blocks for entry in self.excluded_block(program, str(name), event, block)]

    @staticmethod
    def excluded_block(program: str, source: str, event: str, block: object) -> list[UnmanagedHook]:
        if not is_mapping(block) or not is_list(entries := block.get("hooks")):
            return []
        return [UnmanagedHook(program, source, event, "This entry is not a command.") for entry in entries if not ProgramHooks.is_journals(entry)]
