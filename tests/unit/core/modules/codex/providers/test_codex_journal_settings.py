import json
import os
import tomllib
from pathlib import Path

import pytest

from engine.enums.hook_trust import HookTrust
from engine.journal.journal_home import JournalHome
from engine.private.private_folder import PrivateFolder
from engine.private.server_keys import ServerKeys
from engine.provider.program_folders import ProgramFolders
from engine.provider.program_settings import ProgramSettings
from engine.provider.program_settings_writer import ProgramSettingsWriter
from core.modules.codex.providers.codex_provider import CodexProvider
from core.modules.codex.providers.support.codex_trust import CodexTrust

RUNNER = '"/work/journal/.journal/bin/journal-hook"'
PERSON_CONFIG = """\
model = "gpt-6.1-sol"
model_provider = "proxy"
approval_policy = "on-request"

[model_providers.proxy]
name = "Company proxy"
base_url = "https://proxy.example.com/v1"
env_key = "PROXY_KEY"

[model_providers.proxy.http_headers]
X-Team = "agents"

[mcp_servers.docs]
command = "docs-server"

[projects."/Users/someone/elsewhere"]
trust_level = "trusted"
"""


@pytest.fixture
def home(tmp_path: Path) -> JournalHome:
    return JournalHome(tmp_path / "project" / ".journal")


@pytest.fixture
def provider(home: JournalHome) -> CodexProvider:
    return CodexProvider(ProgramFolders(), ServerKeys(PrivateFolder(home)))


@pytest.fixture
def folders(home: JournalHome) -> list[Path]:
    return [home.folder / "worktrees" / "development" / "worker-1", home.project_folder]


def journal_settings(provider: CodexProvider, home: JournalHome, folders: list[Path]) -> ProgramSettings:
    return provider.journal_settings(home, RUNNER, (), folders)


def file_text(settings: ProgramSettings, name: str) -> str:
    return next(file.text for file in settings.files if file.path.name == name)


def person_folder() -> Path:
    return Path(os.environ["CODEX_HOME"])


def test_the_config_holds_the_header_and_bypass(provider, home, folders):
    config = file_text(journal_settings(provider, home, folders), "config.toml")
    assert config.startswith('# Written by the journal at every start; changes are put back.\napproval_policy = "never"\nsandbox_mode = "danger-full-access"\n')
    assert config.endswith("\n") and not config.endswith("\n\n")
    assert [file.path for file in journal_settings(provider, home, folders).files] == [home.program_folder("codex") / "config.toml", home.program_folder("codex") / "hooks.json"]


def test_the_root_and_each_worktree_are_trusted(provider, home, folders):
    projects = tomllib.loads(file_text(journal_settings(provider, home, folders), "config.toml"))["projects"]
    assert projects == {str(folder): {"trust_level": "trusted"} for folder in folders}


def test_the_trust_hashes_match_the_hooks_file(provider, home, folders):
    folder = home.program_folder("codex")
    ProgramSettingsWriter(home).write(journal_settings(provider, home, folders))
    assert CodexTrust(folder / "config.toml").trust((folder / "hooks.json").resolve(), list(CodexProvider.hook_events)) is HookTrust.READY


def test_the_hooks_file_holds_only_journal_entries_with_their_event_fields(provider, home, folders):
    hooks = json.loads(file_text(journal_settings(provider, home, folders), "hooks.json"))
    assert list(hooks) == ["hooks"]
    assert set(hooks["hooks"]) == set(CodexProvider.hook_events)
    entries = {event: blocks[0]["hooks"][0] for event, blocks in hooks["hooks"].items()}
    assert all(len(blocks) == 1 and len(blocks[0]["hooks"]) == 1 for blocks in hooks["hooks"].values())
    assert all(entry["command"] == f'{RUNNER} codex "{home.project_folder}"' for entry in entries.values())
    assert entries["PreToolUse"]["additionalContextLimit"] == 0
    assert entries["SessionEnd"]["timeout"] == 3


def test_the_model_provider_tables_are_carried_and_nothing_else(provider, home, folders):
    person_folder().mkdir(parents=True, exist_ok=True)
    (person_folder() / "config.toml").write_text(PERSON_CONFIG)
    config = tomllib.loads(file_text(journal_settings(provider, home, folders), "config.toml"))
    assert config["model_provider"] == "proxy"
    assert config["model_providers"] == {"proxy": {"name": "Company proxy", "base_url": "https://proxy.example.com/v1", "env_key": "PROXY_KEY",
                                                   "http_headers": {"X-Team": "agents"}}}
    assert config["approval_policy"] == "never"
    assert "model" not in config and "mcp_servers" not in config
    assert "/Users/someone/elsewhere" not in config["projects"]


def test_an_unreadable_person_config_carries_nothing(provider, home, folders):
    person_folder().mkdir(parents=True, exist_ok=True)
    (person_folder() / "config.toml").write_text("model_provider = [unclosed")
    assert "model_provider" not in tomllib.loads(file_text(journal_settings(provider, home, folders), "config.toml"))


def test_the_links_lead_to_the_person_auth_sessions_and_history(provider, home, folders):
    settings = journal_settings(provider, home, folders)
    folder = home.program_folder("codex")
    assert dict(settings.links) == {folder / name: person_folder() / name for name in ("auth.json", "sessions", "history.jsonl")}
    assert settings.person_files == (person_folder() / "hooks.json", person_folder() / "config.toml")


def test_the_same_inputs_give_the_same_bytes(provider, home, folders):
    person_folder().mkdir(parents=True, exist_ok=True)
    (person_folder() / "config.toml").write_text(PERSON_CONFIG)
    first_files = journal_settings(provider, home, folders).files
    assert journal_settings(provider, home, list(reversed(folders))).files == first_files
