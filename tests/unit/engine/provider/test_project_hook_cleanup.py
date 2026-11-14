from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.provider.program_folders import ProgramFolders
from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.provider.project_hook_cleanup import ProjectHookCleanup
from engine.time.clock import Clock
from tests.unit.engine.samples.program_sample import HOOK_FILE, SampleProgram

JOURNAL_ENTRY = {"type": "command", "command": '"/p/.journal/bin/journal-hook" sample "/p"', "timeout": 90}
FOREIGN_ENTRY = {"type": "command", "command": "project-check"}
PROMPT_ENTRY = {"type": "prompt", "prompt": "Review this"}
JOURNAL_STATUS = {"type": "command", "command": '"/p/.journal/bin/journal-hook" --status "/p"', "padding": 0}


@pytest.fixture
def home(tmp_path: Path) -> JournalHome:
    return JournalHome(tmp_path / ".journal")


@pytest.fixture
def cleanup(home: JournalHome) -> ProjectHookCleanup:
    return ProjectHookCleanup(ProgramSettingsBackup(home, SystemLogWriter(home, Clock()), Clock()))


def hook_file(tmp_path: Path) -> Path:
    return tmp_path / HOOK_FILE


def backups(home: JournalHome) -> list[Path]:
    folder = home.program_settings_backups / "sample"
    return sorted(folder.glob("2*")) if folder.is_dir() else []


def test_only_the_journal_entries_are_removed(cleanup, tmp_path):
    ProgramHooks.store(hook_file(tmp_path), {"hooks": {"Start": [{"matcher": "", "hooks": [JOURNAL_ENTRY]}], "End": [{"matcher": "", "hooks": [JOURNAL_ENTRY, FOREIGN_ENTRY]}]}})
    assert cleanup.cleaned(SampleProgram(ProgramFolders()), tmp_path)
    assert ProgramHooks.read(hook_file(tmp_path)) == {"hooks": {"End": [{"matcher": "", "hooks": [FOREIGN_ENTRY]}]}}


def test_foreign_entries_and_other_keys_stay(cleanup, tmp_path):
    ProgramHooks.store(hook_file(tmp_path), {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {"Start": [{"matcher": "Shell", "hooks": [PROMPT_ENTRY, JOURNAL_ENTRY]}]}})
    cleanup.cleaned(SampleProgram(ProgramFolders()), tmp_path)
    assert ProgramHooks.read(hook_file(tmp_path)) == {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {"Start": [{"matcher": "Shell", "hooks": [PROMPT_ENTRY]}]}}


def test_the_journal_status_line_is_removed_and_a_foreign_one_stays(cleanup, tmp_path):
    ProgramHooks.store(hook_file(tmp_path), {"statusLine": JOURNAL_STATUS, "hooks": {"Start": [{"matcher": "", "hooks": [JOURNAL_ENTRY]}]}})
    cleanup.cleaned(SampleProgram(ProgramFolders()), tmp_path)
    assert ProgramHooks.read(hook_file(tmp_path)) == {}
    foreign_status = {"type": "command", "command": "my-status"}
    ProgramHooks.store(hook_file(tmp_path), {"statusLine": foreign_status, "hooks": {"Start": [{"matcher": "", "hooks": [JOURNAL_ENTRY]}]}})
    cleanup.cleaned(SampleProgram(ProgramFolders()), tmp_path)
    assert ProgramHooks.read(hook_file(tmp_path)) == {"statusLine": foreign_status}


def test_the_file_is_backed_up_first(cleanup, home, tmp_path):
    ProgramHooks.store(hook_file(tmp_path), {"hooks": {"Start": [{"matcher": "", "hooks": [JOURNAL_ENTRY]}]}})
    original = hook_file(tmp_path).read_bytes()
    cleanup.cleaned(SampleProgram(ProgramFolders()), tmp_path)
    assert [copy.read_bytes() for copy in backups(home)] == [original]
    assert backups(home)[0].name.endswith("-project-hooks.json")


def test_nothing_to_remove_writes_nothing_and_backs_up_nothing(cleanup, home, tmp_path):
    ProgramHooks.store(hook_file(tmp_path), {"hooks": {"Start": [{"matcher": "", "hooks": [FOREIGN_ENTRY]}]}})
    modified_nanoseconds = hook_file(tmp_path).stat().st_mtime_ns
    assert not cleanup.cleaned(SampleProgram(ProgramFolders()), tmp_path)
    assert hook_file(tmp_path).stat().st_mtime_ns == modified_nanoseconds
    assert backups(home) == []


def test_a_missing_file_is_left_alone(cleanup, home, tmp_path):
    assert not cleanup.cleaned(SampleProgram(ProgramFolders()), tmp_path)
    assert not hook_file(tmp_path).exists()
    assert backups(home) == []
