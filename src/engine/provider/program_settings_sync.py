from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from engine.errors.refusal import Refusal
from engine.file.kept_bytes import KeptBytes
from engine.journal.journal_home import JournalHome
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import JOURNAL_MARKS
from engine.provider.program_settings import ProgramSettings
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.provider.program_settings_writer import ProgramSettingsWriter
from engine.provider.providers import Providers

WORKTREE_PATTERN = "*/*"
SHELL_RUNNER_MARK = JOURNAL_MARKS[1]


class ProgramSettingsSync:
    """Brings the journal's own settings files of each agent program up to date: before a launch and at server
    start it first backs up the person's own files, and on a tick it only writes the journal's."""

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, writer: ProgramSettingsWriter,
                 backup: ProgramSettingsBackup) -> None:
        self.home, self.providers, self.managed, self.writer, self.backup = home, providers, managed, writer, backup

    def settings(self, program: str) -> ProgramSettings:
        provider = self.providers.provider(program)
        return provider.journal_settings(self.home, self.runner(), self.managed.all(), self.folders())

    def runner(self) -> str:
        choice = self.home.hook_runner_choice
        if not choice.is_file():
            return f'"{self.home.hook_runner}"'
        return KeptBytes.read(choice).decode().strip()

    @property
    def uses_shell_runner(self) -> bool:
        return SHELL_RUNNER_MARK in self.runner()

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

    def unreadable_person_files(self) -> tuple[Path, ...]:
        return tuple(path for provider in self.providers.all() for path in self.settings(provider.name).unreadable_person_files)

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
