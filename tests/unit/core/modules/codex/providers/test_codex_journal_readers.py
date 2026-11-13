import os
from pathlib import Path

import pytest

from engine.enums.hook_trust import HookTrust
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.private.private_folder import PrivateFolder
from engine.private.server_keys import ServerKeys
from engine.provider.model_efforts import ModelEfforts
from engine.provider.program_folders import ProgramFolders
from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_settings_backup import ProgramSettingsBackup
from engine.provider.project_hook_cleanup import ProjectHookCleanup
from engine.provider.program_settings_writer import ProgramSettingsWriter
from engine.time.clock import Clock
from core.modules.codex.providers.codex_provider import CodexProvider

RUNNER = '"/work/journal/.journal/bin/journal-hook"'


class NoEffortSettings:
    """Effort settings with no entry a user set."""

    def texts(self, key: str) -> tuple[str, ...]:
        return ()


@pytest.fixture
def home(tmp_path: Path) -> JournalHome:
    return JournalHome(tmp_path / "project" / ".journal")


@pytest.fixture
def provider(home: JournalHome) -> CodexProvider:
    return CodexProvider(ProgramFolders(), ServerKeys(PrivateFolder(home)), ModelEfforts(NoEffortSettings()))


def person_folder() -> Path:
    return Path(os.environ["CODEX_HOME"])


def write_journal_folder(provider: CodexProvider, home: JournalHome) -> None:
    ProgramSettingsWriter(home).write(provider.journal_settings(home, RUNNER, (), [home.project_folder]))


def test_a_transcript_is_found_in_the_sessions_the_journal_folder_links_to(provider, home):
    rollout = person_folder() / "sessions" / "2026" / "11" / "12" / "rollout-2026-11-12T00-00-00-t-1.jsonl"
    rollout.parent.mkdir(parents=True)
    rollout.write_text("{}\n")
    write_journal_folder(provider, home)
    assert provider.transcript(home.project_folder, "t-1") == rollout
    assert (home.program_folder("codex") / "sessions" / "2026" / "11" / "12" / rollout.name).is_file()


def test_hook_trust_is_ready_after_the_journal_writes_its_folder(provider, home):
    write_journal_folder(provider, home)
    assert provider.journal_trust(home) is HookTrust.READY


def test_hook_trust_is_unwritten_with_no_journal_hooks_file(provider, home):
    assert provider.journal_trust(home) is HookTrust.UNWRITTEN


def test_a_journal_write_leaves_the_person_config_untouched(provider, home):
    person_folder().mkdir(parents=True, exist_ok=True)
    config = person_folder() / "config.toml"
    config.write_text('model = "gpt-6.1-sol"\n')
    before = (config.read_bytes(), config.stat().st_mtime_ns)
    write_journal_folder(provider, home)
    assert (config.read_bytes(), config.stat().st_mtime_ns) == before


def test_old_codex_journal_entries_are_removed_and_foreign_ones_stay(provider, home, tmp_path):
    journal_block = {"matcher": "", "hooks": [{"type": "command", "command": f'{RUNNER} codex "/work/journal"', "additionalContextLimit": 0}]}
    foreign_block = {"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check"}]}
    ProgramHooks.store(home.project_folder / ".codex" / "hooks.json", {"hooks": {"PreToolUse": [journal_block, foreign_block]}})
    cleanup = ProjectHookCleanup(ProgramSettingsBackup(home, SystemLogWriter(home, Clock()), Clock()))
    assert cleanup.cleaned(provider, home.project_folder)
    assert ProgramHooks.read(home.project_folder / ".codex" / "hooks.json") == {"hooks": {"PreToolUse": [foreign_block]}}
