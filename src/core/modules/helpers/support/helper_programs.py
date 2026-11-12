import shutil
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.enums.hook_trust import HookTrust
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from engine.provider.providers import Providers
from engine.provider.program_settings_sync import ProgramSettingsSync
from engine.errors.refusal import Refusal


class HelperPrograms:
    """Makes sure a program can run under the journal's rules in a folder: it is installed, its hooks are
    written there and trusted, each naming the project root where the journal's server runs even in a
    worktree, and the folder itself is trusted, so no person has to accept either; a program with no hooks
    runs with no rule at all."""

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, sync: ProgramSettingsSync) -> None:
        self.home, self.providers, self.managed, self.sync = home, providers, managed, sync

    def installed(self, program: str) -> None:
        provider = self.providers.provider(program)
        if shutil.which(provider.executable) is None:
            raise Refusal(f"{program} is not installed here", f"install {provider.executable} or name another program")

    def checked(self, program: str, folder: Path) -> None:
        self.installed(program)
        self.sync.prepare(program)
        provider = self.providers.provider(program)
        hooks = ProgramHooks.hooks(type(provider), folder)
        provider.folder_trusted(folder)
        hooks_ready = hooks.is_complete() and hooks.names_root(self.home.project_folder) and provider.hook_trust(folder) is HookTrust.READY
        if hooks_ready:
            return
        hooks.write(f'"{self.home.hook_runner}"', self.home.project_folder, self.managed.all())
