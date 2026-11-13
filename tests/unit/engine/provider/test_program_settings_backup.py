import os
import stat
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.provider.program_settings import ProgramSettings
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp


class SetClock(Clock):
    """A clock that stands at a time the test sets and moves only when the test moves it."""

    def __init__(self) -> None:
        self.now = datetime(2026, 11, 11, 22, 15, tzinfo=timezone.utc)

    def timestamp(self) -> Timestamp:
        return Timestamp(self.now)

    def moved(self, seconds: int) -> None:
        self.now += timedelta(seconds=seconds)


@pytest.fixture
def clock() -> SetClock:
    return SetClock()


@pytest.fixture
def home(tmp_path: Path) -> JournalHome:
    return JournalHome(tmp_path / "project" / ".journal")


@pytest.fixture
def backup(home: JournalHome, clock: SetClock) -> ProgramSettingsBackup:
    return ProgramSettingsBackup(home, SystemLogWriter(home, clock), clock)


@pytest.fixture
def person_files(tmp_path: Path) -> tuple[Path, Path]:
    folder = tmp_path / "person" / ".codex"
    folder.mkdir(parents=True)
    (folder / "config.toml").write_text('model = "gpt-6.1-sol"\n')
    (folder / "hooks.json").write_text('{"hooks": {}}\n')
    return folder / "config.toml", folder / "hooks.json"


def mode_of(path: Path) -> int:
    return stat.S_IMODE(path.stat().st_mode)


def test_the_first_start_copies_each_file_with_mode_0600(backup, home, person_files):
    copies = backup.backup_copies(ProgramSettings("codex", (), person_files=person_files))
    assert [copy.name for copy in copies] == ["20261111T221500Z-config.toml", "20261111T221500Z-hooks.json"]
    assert [copy.read_bytes() for copy in copies] == [path.read_bytes() for path in person_files]
    assert all(mode_of(copy) == 0o600 for copy in copies)


def test_the_original_bytes_and_times_are_unchanged(backup, person_files):
    os.chmod(person_files[0], 0o640)
    previous = [(path.read_bytes(), path.stat().st_mtime_ns, mode_of(path)) for path in person_files]
    backup.backup_copies(ProgramSettings("codex", (), person_files=person_files))
    assert [(path.read_bytes(), path.stat().st_mtime_ns, mode_of(path)) for path in person_files] == previous


def test_an_unchanged_file_is_not_copied_again(backup, clock, person_files):
    settings = ProgramSettings("codex", (), person_files=person_files)
    backup.backup_copies(settings)
    clock.moved(60)
    assert backup.backup_copies(settings) == ()


def test_a_changed_file_gets_a_new_copy_and_the_older_stays(backup, clock, person_files):
    settings = ProgramSettings("codex", (), person_files=person_files[:1])
    first_copy = backup.backup_copies(settings)[0]
    person_files[0].write_text('model = "gpt-6-luna"\n')
    clock.moved(60)
    assert [copy.name for copy in backup.backup_copies(settings)] == ["20261111T221600Z-config.toml"]
    assert first_copy.read_text() == 'model = "gpt-6.1-sol"\n'
    assert backup.newest("codex", "config.toml").read_text() == 'model = "gpt-6-luna"\n'


def test_two_copies_in_one_second_get_a_number(backup, person_files):
    settings = ProgramSettings("codex", (), person_files=person_files[:1])
    backup.backup_copies(settings)
    person_files[0].write_text('model = "gpt-6-luna"\n')
    assert [copy.name for copy in backup.backup_copies(settings)] == ["20261111T221500Z-1-config.toml"]
    assert backup.newest("codex", "config.toml").read_text() == 'model = "gpt-6-luna"\n'


def test_twenty_copies_are_kept_beside_the_first(backup, clock, person_files):
    settings = ProgramSettings("codex", (), person_files=person_files[:1])
    for number in range(30):
        person_files[0].write_text(f"model = \"model-{number}\"\n")
        backup.backup_copies(settings)
        clock.moved(60)
    copies = backup.copies("codex", "config.toml")
    assert len(copies) == 21
    assert copies[0].read_text() == 'model = "model-0"\n'
    assert [copy.read_text() for copy in copies[1:]] == [f"model = \"model-{number}\"\n" for number in range(10, 30)]


def test_the_project_hooks_file_keeps_its_own_copies(backup, home, person_files, tmp_path):
    project_hooks = tmp_path / "project" / ".codex" / "hooks.json"
    project_hooks.parent.mkdir(parents=True)
    project_hooks.write_text('{"hooks": {"Stop": []}}\n')
    backup.backup_copies(ProgramSettings("codex", (), person_files=person_files))
    assert backup.project_copied("codex", project_hooks).name == "20261111T221500Z-project-hooks.json"
    assert backup.newest("codex", "hooks.json").read_text() == '{"hooks": {}}\n'
    assert backup.newest("codex", "project-hooks.json").read_text() == '{"hooks": {"Stop": []}}\n'


def test_a_missing_file_is_skipped_without_a_log_line(backup, home, tmp_path):
    assert backup.backup_copies(ProgramSettings("claude", (), person_files=tuple([tmp_path / "missing" / "settings.json"]))) == ()
    assert not home.system_log.exists()


@pytest.mark.skipif(os.geteuid() == 0, reason="root reads a file with mode 000")
def test_an_unreadable_file_is_logged_and_the_rest_backed_up(backup, home, person_files):
    os.chmod(person_files[0], 0)
    try:
        copies = backup.backup_copies(ProgramSettings("codex", (), person_files=person_files))
    finally:
        os.chmod(person_files[0], 0o600)
    assert [copy.name for copy in copies] == ["20261111T221500Z-hooks.json"]
    assert f"the backup of {person_files[0]} failed: Permission denied" in home.system_log.read_text()


def test_the_backup_folder_is_private(backup, home, person_files):
    backup.backup_copies(ProgramSettings("codex", (), person_files=person_files))
    assert mode_of(home.program_settings_backups / "codex") == 0o700
    assert mode_of(home.program_settings_backups) == 0o700
