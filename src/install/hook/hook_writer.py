import sys
import shlex
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.hook_manager import HookManager
from core.modules import DEFAULT_MODULES


class HookWriter:
    """Records the hook runner the install chose, for the journal's own settings files of every agent program, and
    imports the project hooks of every program into the managed store; it writes no hook of the journal into the
    project."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.providers = [provider for module in DEFAULT_MODULES for provider in module.providers]

    def write(self, runner: str) -> list[ManagedHook]:
        self.record_runner(runner)
        return self.import_hooks(runner)

    def import_hooks(self, runner: str) -> list[ManagedHook]:
        if shlex.split(runner) != [str(self.root / ".journal/bin/journal-hook")]:
            return self.managed()
        rules = [rule for module in DEFAULT_MODULES for rule in module.driver_rules]
        manager = HookManager(self.root, ManagedHooks(JournalHome(self.root / ".journal")), rules)
        for provider in self.providers:
            manager.import_hooks(provider, self.root)
        return self.managed()

    def record_runner(self, runner: str) -> None:
        choice = JournalHome(self.root / ".journal").hook_runner_choice
        choice.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(choice, f"{runner}\n")

    def managed(self) -> list[ManagedHook]:
        return ManagedHooks(JournalHome(self.root / ".journal")).all()


if __name__ == "__main__":
    HookWriter(Path(sys.argv[1])).write(sys.argv[2])
