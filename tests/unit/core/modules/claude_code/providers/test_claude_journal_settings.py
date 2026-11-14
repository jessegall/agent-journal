import json
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.private.private_folder import PrivateFolder
from engine.private.server_keys import ServerKeys
from engine.provider.managed_hook import ManagedHook
from engine.provider.model_efforts import ModelEfforts
from engine.provider.program_folders import ProgramFolders
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider

RUNNER = '"/work/journal/.journal/bin/journal-hook"'
PERSON_HOOK = {"matcher": "Bash", "hooks": [{"type": "command", "command": "my-linter"}]}


class NoEffortSettings:
    """Effort settings with no entry a user set."""

    def texts(self, key: str) -> tuple[str, ...]:
        return ()


@pytest.fixture
def home(tmp_path: Path) -> JournalHome:
    return JournalHome(tmp_path / "project" / ".journal")


@pytest.fixture
def provider(home: JournalHome) -> ClaudeCodeProvider:
    return ClaudeCodeProvider(ProgramFolders(), ServerKeys(PrivateFolder(home)), ModelEfforts(NoEffortSettings()))


def journal_file(provider: ClaudeCodeProvider, home: JournalHome, managed: tuple[ManagedHook, ...] = ()) -> dict[str, object]:
    settings = provider.journal_settings(home, RUNNER, managed, [home.project_folder])
    assert [file.path for file in settings.files] == [home.program_settings_file("claude"), home.program_folder("claude") / "mcp.json"]
    return json.loads(settings.files[0].text)


def person_file(provider: ClaudeCodeProvider, settings: dict[str, object]) -> None:
    path = provider.user_hook_files()[0]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(settings))


def test_the_file_holds_bypass_status_line_and_auto_memory_off(provider, home):
    stored = journal_file(provider, home)
    assert stored["permissions"] == {"defaultMode": "bypassPermissions"}
    assert stored["autoMemoryEnabled"] is False
    assert stored["statusLine"] == {"type": "command", "command": f'{RUNNER} --status "{home.project_folder}"', "padding": 0}


def test_one_journal_entry_per_hook_event_and_no_other_hook(provider, home):
    hooks = journal_file(provider, home)["hooks"]
    assert list(hooks) == sorted(ClaudeCodeProvider.hook_events)
    assert all(len(blocks) == 1 and len(blocks[0]["hooks"]) == 1 and blocks[0]["hooks"][0]["command"] == f'{RUNNER} claude "{home.project_folder}"'
               for blocks in hooks.values())


def test_a_hook_in_the_person_settings_is_not_carried(provider, home):
    person_file(provider, {"hooks": {"PreToolUse": [PERSON_HOOK]}})
    assert "my-linter" not in json.dumps(journal_file(provider, home))


def test_only_env_and_api_key_helper_are_carried(provider, home):
    person_file(provider, {"env": {"HTTPS_PROXY": "http://proxy:8080"}, "apiKeyHelper": "/usr/local/bin/key", "hooks": {"Stop": [PERSON_HOOK]},
                           "enabledPlugins": {"sample@market": True}, "permissions": {"allow": ["Bash(ls)"]},
                           "statusLine": {"type": "command", "command": "my-status"}})
    stored = journal_file(provider, home)
    assert stored["env"] == {"HTTPS_PROXY": "http://proxy:8080"}
    assert stored["apiKeyHelper"] == "/usr/local/bin/key"
    assert set(stored) == {"env", "apiKeyHelper", "permissions", "autoMemoryEnabled", "statusLine", "hooks"}
    assert stored["permissions"] == {"defaultMode": "bypassPermissions"}
    assert "my-status" not in json.dumps(stored) and "my-linter" not in json.dumps(stored)


def test_an_unreadable_person_file_carries_nothing(provider, home):
    path = provider.user_hook_files()[0]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("{ not json")
    assert "env" not in journal_file(provider, home)


def test_the_same_inputs_give_the_same_bytes(provider, home):
    person_file(provider, {"env": {"B": "2", "A": "1"}})
    first_text = provider.journal_settings(home, RUNNER, (), [home.project_folder]).files[0].text
    assert provider.journal_settings(home, RUNNER, (), [home.project_folder]).files[0].text == first_text
    assert first_text.endswith("}\n")


def test_a_managed_hook_lengthens_the_entry_timeout(provider, home):
    managed = tuple([ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "slow", "timeout": 60}, "settings.json", False)])
    hooks = journal_file(provider, home, managed)["hooks"]
    assert hooks["PreToolUse"][0]["hooks"][0]["timeout"] == 150
    assert hooks["Stop"][0]["hooks"][0]["timeout"] == 90


def test_the_entries_name_the_main_root(provider, home, tmp_path):
    worktree = home.folder / "worktrees" / "development" / "worker-1"
    hooks = provider.journal_settings(home, RUNNER, (), [home.project_folder, worktree]).files[0].text
    assert f'claude \\"{(tmp_path / "project").resolve()}\\"' in hooks
    assert str(worktree) not in hooks


def test_the_person_file_is_listed_for_backup(provider, home):
    assert provider.journal_settings(home, RUNNER, (), []).person_files == provider.user_hook_files()
