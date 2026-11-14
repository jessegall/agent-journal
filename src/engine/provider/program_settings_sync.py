from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from engine.agent.program_sessions import ProgramSessions
from engine.errors.refusal import Refusal
from engine.provider.provider import Provider
from engine.file.file_access import FileAccess
from engine.file.private_folders import PrivateFolders
from engine.file.kept_bytes import KeptBytes
from engine.journal.journal_home import JournalHome
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import JOURNAL_MARKS
from engine.provider.program_settings import ProgramSettings
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.provider.program_settings_writer import ProgramSettingsWriter
from engine.provider.project_hook_cleanup import ProjectHookCleanup
from engine.provider.providers import Providers
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from engine.checkout.project_checkouts import ProjectCheckouts

SHELL_RUNNER_MARK = JOURNAL_MARKS[1]


class ProgramSettingsSync:
    """Brings the journal's own settings files of each agent program up to date: before a launch and at server
    start it first backs up the user's own files, and on a tick it only writes the journal's. It takes the
    journal's old entries out of the project files of each program, once no session of that program that
    started before the switch still runs."""

    def __init__(self, home: JournalHome, providers: Providers, managed: ManagedHooks, writer: ProgramSettingsWriter,
                 backup: ProgramSettingsBackup, cleanup: ProjectHookCleanup, sessions: ProgramSessions, clock: Clock, checkouts: ProjectCheckouts) -> None:
        self.home, self.providers, self.managed, self.writer, self.backup = home, providers, managed, writer, backup
        self.cleanup, self.sessions, self.clock, self.checkouts = cleanup, sessions, clock, checkouts

    def settings(self, program: str) -> ProgramSettings:
        return self.provider_settings(self.providers.provider(program))

    def provider_settings(self, provider: Provider) -> ProgramSettings:
        return provider.journal_settings(self.home, self.runner(), self.managed.all(), self.folders())

    def runner(self) -> str:
        choice = self.home.hook_runner_choice
        if not FileAccess.is_file(choice):
            return f'"{self.home.hook_runner}"'
        return KeptBytes.read(choice).decode().strip()

    @property
    def uses_shell_runner(self) -> bool:
        return SHELL_RUNNER_MARK in self.runner()

    def folders(self) -> tuple[Path, ...]:
        return (self.home.project_folder, *self.checkouts.folders())

    def prepare(self, program: str) -> tuple[Path, ...]:
        settings = self.settings(program)
        with self.failure_refusal(program):
            self.backup.backup_copies(settings.program, settings.person_files_read())
            self.clean_project_files(program)
            return self.writer.write(settings)

    def write(self, program: str) -> tuple[Path, ...]:
        settings = self.settings(program)
        with self.failure_refusal(program):
            self.clean_project_files(program)
            return self.writer.write(settings)

    def clean_project_files(self, program: str) -> None:
        provider = self.providers.provider(program)
        if self.is_cleanup_blocked(program):
            return
        for folder in self.folders():
            self.cleanup.cleaned(provider, folder)

    def is_cleanup_blocked(self, program: str) -> bool:
        return self.sessions.has_prior_session(program, self.switched_at())

    def blocked_cleanups(self) -> tuple[str, ...]:
        return tuple(provider.name for provider in self.providers.all() if self.is_cleanup_blocked(provider.name)
                     and any(self.cleanup.has_journal_entries(provider, folder) for folder in self.folders()))

    def switched_at(self) -> Timestamp:
        switch = self.home.program_settings_switch
        if not FileAccess.is_file(switch):
            PrivateFolders.made(switch.parent)
            FileAccess.write(switch, f"{self.clock.timestamp().text}\n")
        return Timestamp.parsed(KeptBytes.read(switch).decode().strip())

    def unreadable_person_files(self) -> tuple[Path, ...]:
        return tuple(path for provider in self.providers.all() for path in self.provider_settings(provider).unreadable_person_files)

    def prepare_all(self) -> tuple[Path, ...]:
        return tuple(path for provider in self.providers.all() for path in self.prepare(provider.name))

    def write_all(self) -> tuple[Path, ...]:
        return tuple(path for provider in self.providers.all() for path in self.write(provider.name))

    @contextmanager
    def failure_refusal(self, program: str) -> Generator[None]:
        try:
            yield
        except OSError as error:
            title = self.providers.provider(program).title
            raise Refusal(f"the journal could not write its {title} settings: {error.strerror or error}; nothing was started",
                          "free disk space or make .journal/programs writable, then launch again") from error
