import shutil
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.provider.hook_trust import HookTrust
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from core.base.provider.providers import Providers
from core.base.refusal import Refusal

HOOK_RUNNER = "bin/journal-hook"


class HelperPrograms:
    """Makes sure a program can run under the journal's rules in a folder: it is installed, its hooks are written
    there, and it trusts them, since a program with no hooks runs with no rule at all."""

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks) -> None:
        self.home, self.providers, self.managed = home, providers, managed

    def installed(self, program: str) -> None:
        provider = self.providers.provider(program)
        if shutil.which(provider.executable) is None:
            raise Refusal(f"{program} is not installed here", f"install {provider.executable} or name another program")

    def checked(self, program: str, folder: Path) -> None:
        self.installed(program)
        provider = self.providers.provider(program)
        hooks = ProgramHooks.hooks(type(provider), folder)
        if not hooks.is_complete():
            hooks.write(f'"{self.home.folder / HOOK_RUNNER}"', folder, self.managed.all())
        if provider.hook_trust(folder) is not HookTrust.READY:
            raise Refusal(f"the journal cannot use untrusted {program} hooks in {folder}", "install the journal's hooks in that folder")
