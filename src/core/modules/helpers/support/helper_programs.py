import shutil
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.enums.hook_trust import HookTrust
from engine.provider.program_settings_sync import ProgramSettingsSync
from engine.provider.program_hooks import ProgramHooks
from engine.provider.provider import Provider
from engine.provider.providers import Providers
from engine.errors.refusal import Refusal


class HelperPrograms:
    """Makes sure a program can run under the journal's rules in a folder: it is installed, the journal's own
    settings of the program hold its hooks, trusted and naming the project root where the journal's server
    runs even in a separate copy of the project, and the folder itself is trusted, so no person has to
    accept either."""

    def __init__(self, home: JournalHome, providers: Providers, sync: ProgramSettingsSync) -> None:
        self.home, self.providers, self.sync = home, providers, sync

    def installed(self, program: str) -> None:
        provider = self.providers.provider(program)
        if shutil.which(provider.executable) is None:
            raise Refusal(f"{program} is not installed here", f"install {provider.executable} or name another program")

    def hooks_ready(self, provider: Provider) -> bool:
        hooks = ProgramHooks.journal(type(provider), provider.journal_hook_file(self.home))
        return hooks.is_complete() and hooks.names_root(self.home.project_folder) and provider.journal_trust(self.home) is HookTrust.READY

    def checked(self, program: str, folder: Path) -> None:
        self.installed(program)
        provider = self.providers.provider(program)
        provider.folder_trusted(folder)
        if self.hooks_ready(provider):
            return
        self.sync.prepare(program)
        if self.hooks_ready(provider):
            return
        raise Refusal(f"the journal could not write the hooks of {program}", f"run journal program manage {program} {folder} and look at the server log")
