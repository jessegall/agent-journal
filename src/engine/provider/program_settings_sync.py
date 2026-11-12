from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_settings import ProgramSettings
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.provider.program_settings_writer import ProgramSettingsWriter
from engine.provider.providers import Providers

WORKTREE_PATTERN = "*/*"


class ProgramSettingsSync:
    """Brings the journal's own settings files of each agent program up to date: before a launch and at server
    start it first backs up the person's own files, and on a tick it only writes the journal's."""

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, writer: ProgramSettingsWriter,
                 backup: ProgramSettingsBackup) -> None:
        self.home, self.providers, self.managed, self.writer, self.backup = home, providers, managed, writer, backup

    def settings(self, program: str) -> ProgramSettings:
        provider = self.providers.provider(program)
        return provider.journal_settings(self.home, f'"{self.home.hook_runner}"', self.managed.all(), self.folders())

    def folders(self) -> tuple[Path, ...]:
        worktrees = self.home.worktrees_folder
        found_worktrees = sorted(folder.resolve() for folder in worktrees.glob(WORKTREE_PATTERN) if folder.is_dir()) if worktrees.is_dir() else []
        return (self.home.project_folder, *found_worktrees)

    def prepare(self, program: str) -> tuple[Path, ...]:
        settings = self.settings(program)
        with self.refused_on_failure(program):
            self.backup.backed_up(settings)
            return self.writer.write(settings)

    def write(self, program: str) -> tuple[Path, ...]:
        settings = self.settings(program)
        with self.refused_on_failure(program):
            return self.writer.write(settings)

    def prepare_all(self) -> tuple[Path, ...]:
        return tuple(path for provider in self.providers.all() for path in self.prepare(provider.name))

    def write_all(self) -> tuple[Path, ...]:
        return tuple(path for provider in self.providers.all() for path in self.write(provider.name))

    @contextmanager
    def refused_on_failure(self, program: str) -> Generator[None]:
        try:
            yield
        except OSError as error:
            title = self.providers.provider(program).title
            raise Refusal(f"the journal could not write its {title} settings: {error.strerror or error}; nothing was started",
                          "free disk space or make .journal/programs writable, then launch again") from error
