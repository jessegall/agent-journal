import sys
import shlex
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.hook_manager import HookManager
from engine.provider.program_hooks import ProgramHooks
from core.modules import DEFAULT_MODULES


class HookWriter:
    """Writes the hooks of every agent program the journal ships into a project, each calling the given hook
    runner, and records that runner for the journal's own settings files; an upgrade touches only the programs
    whose hook file the project already has."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.providers = [provider for module in DEFAULT_MODULES for provider in module.providers]
        self.programs = [ProgramHooks.hooks(provider, root) for provider in self.providers]

    def write(self, runner: str, is_upgrade: bool = False) -> None:
        self.record_runner(runner)
        managed = self.managed()
        installed_programs: list[ProgramHooks] = []
        for provider, program in zip(self.providers, self.programs, strict=True):
            if is_upgrade and not any((self.root / name).is_file() for name in (*provider.hook_files, provider.hook_file.path)):
                continue
            program.write(runner, self.root, managed)
            installed_programs.append(program)
        imported = self.import_hooks(runner)
        if imported != managed:
            for program in installed_programs:
                program.write(runner, self.root, imported)

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
    HookWriter(Path(sys.argv[1])).write(sys.argv[2], sys.argv[3:] == ["1"])
