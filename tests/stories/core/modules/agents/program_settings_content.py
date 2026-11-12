import json
import os
import tomllib
from pathlib import Path

from core.modules.agents.ticks.program_settings_tick import ProgramSettingsTick
from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.fixtures import MainEnvironment

CLAUDE_EVENTS = ["MessageDisplay", "PostToolUse", "PostToolUseFailure", "PreCompact", "PreToolUse", "SessionEnd", "SessionStart", "Stop", "StopFailure",
                 "UserPromptSubmit"]
CODEX_EVENTS = ["PostToolUse", "PreCompact", "PreToolUse", "SessionEnd", "SessionStart", "Stop", "UserPromptSubmit"]
CODEX_KEYS = ["post_tool_use", "pre_compact", "pre_tool_use", "session_end", "session_start", "stop", "user_prompt_submit"]
CODEX_CONTEXT_EVENTS = ("SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse")
CODEX_STATE = ["auth.json", "sessions", "history.jsonl", "state_5.sqlite", "thread_history_1.sqlite", "session_index.jsonl", "rules", "skills", "plugins"]
HEADER = "# Written by the journal at every start; changes are put back."
CARRIED_CLAUDE_KEYS = {"env": {"ANTHROPIC_BASE_URL": "https://gateway.example.com"}, "apiKeyHelper": "/usr/local/bin/key", "awsAuthRefresh": "aws sso login",
                       "awsCredentialExport": "/usr/local/bin/aws-export", "forceLoginMethod": "claudeai", "forceLoginOrgUUID": "org-1",
                       "otelHeadersHelper": "/usr/local/bin/otel", "includeCoAuthoredBy": False, "skipDangerousModePermissionPrompt": True}
PERSON_HOOK = {"matcher": "Bash", "hooks": [{"type": "command", "command": "person-linter", "timeout": 30}]}
PERSON_CONFIG = """\
model = "gpt-6.1-sol"
model_provider = "x"

[model_providers.x]
name = "Proxy"
base_url = "https://proxy.example.com/v1"

[model_providers.x.http_headers]
X-Team = "agents"

[mcp_servers.docs]
command = "docs-server"
"""


def claude_person_file() -> Path:
    return Path(os.environ["CLAUDE_CONFIG_DIR"]) / "settings.json"


def codex_person_folder() -> Path:
    return Path(os.environ["CODEX_HOME"])


def claude_settings(story) -> dict[str, object]:
    return json.loads((story.home.folder / "programs" / "claude" / "settings.json").read_text())


def codex_file(story, name: str) -> str:
    return (story.home.folder / "programs" / "codex" / name).read_text()


def runner(story) -> str:
    return f'"{story.home.folder / "bin" / "journal-hook"}"'


def person_files_with_everything() -> None:
    ProgramHooks.store(claude_person_file(), {**CARRIED_CLAUDE_KEYS, "hooks": {"PreToolUse": [PERSON_HOOK]}, "enabledPlugins": {"sample@market": True},
                                              "permissions": {"allow": ["Bash(ls)"], "deny": ["Bash(rm:*)"]}, "cleanupPeriodDays": 7,
                                              "statusLine": {"type": "command", "command": "person-status"}})
    codex_person_folder().mkdir(parents=True, exist_ok=True)
    (codex_person_folder() / "config.toml").write_text(PERSON_CONFIG)
    for name in CODEX_STATE:
        if "." in name:
            (codex_person_folder() / name).write_text("{}")
        else:
            (codex_person_folder() / name).mkdir()


def expect_claude_file(story, settings: dict[str, object]) -> None:
    root = story.home.project_folder
    entry = {"type": "command", "command": f'{runner(story)} claude "{root}"', "timeout": 90}
    story.expect_rows(settings["permissions"] == {"defaultMode": "bypassPermissions"}, settings["autoMemoryEnabled"] is False,
                      settings["statusLine"] == {"type": "command", "command": f'{runner(story)} --status "{root}"', "padding": 0},
                      list(settings["hooks"]) == CLAUDE_EVENTS, settings["hooks"]["PreToolUse"][0]["hooks"][0]["timeout"] == 150,
                      all(blocks == [{"matcher": "", "hooks": [entry]}] for event, blocks in settings["hooks"].items() if event != "PreToolUse"),
                      set(settings) == {*CARRIED_CLAUDE_KEYS, "permissions", "autoMemoryEnabled", "statusLine", "hooks"},
                      all(settings[key] == value for key, value in CARRIED_CLAUDE_KEYS.items()), "person-" not in json.dumps(settings))


def expect_codex_files(story) -> None:
    text = codex_file(story, "config.toml")
    config = tomllib.loads(text)
    hooks = json.loads(codex_file(story, "hooks.json"))
    entries = {event: blocks[0]["hooks"] for event, blocks in hooks["hooks"].items()}
    states = config["hooks"]["state"]
    folder = story.home.folder / "programs" / "codex"
    story.expect_rows(text.startswith(f"{HEADER}\n"), config["approval_policy"] == "never", config["sandbox_mode"] == "danger-full-access",
                      config["projects"][str(story.home.project_folder)] == {"trust_level": "trusted"},
                      sorted(key.split(":")[-3] for key in states) == CODEX_KEYS,
                      all(key.startswith(f"{(folder / 'hooks.json').resolve()}:") and state["enabled"] is True and state["trusted_hash"].startswith("sha256:")
                          for key, state in states.items()),
                      set(config) == {"approval_policy", "sandbox_mode", "model_provider", "model_providers", "projects", "hooks"},
                      config["model_provider"] == "x",
                      config["model_providers"] == {"x": {"name": "Proxy", "base_url": "https://proxy.example.com/v1", "http_headers": {"X-Team": "agents"}}},
                      list(hooks) == ["hooks"], list(entries) == CODEX_EVENTS, all(len(entry) == 1 for entry in entries.values()),
                      all(entry[0]["command"] == f'{runner(story)} codex "{story.home.project_folder}"' for entry in entries.values()),
                      all(entries[event][0]["additionalContextLimit"] == 0 for event in CODEX_CONTEXT_EVENTS),
                      entries["SessionEnd"][0]["timeout"] == 3, "additionalContextLimit" not in entries["Stop"][0],
                      all((folder / name).is_symlink() and Path(os.readlink(folder / name)) == codex_person_folder() / name for name in CODEX_STATE))


def test_the_journal_files_hold_bypass_its_own_hooks_and_only_the_person_keys_it_carries(new_story):
    story = new_story(fixture=MainEnvironment)
    person_files_with_everything()
    worktree = story.home.folder / "worktrees" / "development" / "worker-1"
    ProgramHooks.store(worktree / ".claude" / "settings.json",
                       {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 60}]}]}})
    story.expect_text(f'program manage claude "{worktree}"', "managed hooks: 1")
    story.expect_text(f'program command codex "{story.home.project_folder}" --launch launch-1 --format json', "CODEX_HOME")
    expect_claude_file(story, claude_settings(story))
    expect_codex_files(story)


def test_two_writes_with_nothing_changed_give_the_same_bytes(new_story):
    story = new_story(fixture=MainEnvironment)
    files = [story.home.folder / "programs" / "claude" / "settings.json", story.home.folder / "programs" / "codex" / "config.toml",
             story.home.folder / "programs" / "codex" / "hooks.json"]
    story.expect_text(f'program command claude "{story.home.project_folder}" --launch launch-1', "claude")
    story.expect_text(f'program command codex "{story.home.project_folder}" --launch launch-2 --format json', "CODEX_HOME")
    first_bytes = [path.read_bytes() for path in files]
    story.expect_text(f'program command codex "{story.home.project_folder}" --launch launch-3 --format json', "CODEX_HOME")
    story.expect_text(f'program command claude "{story.home.project_folder}" --launch launch-4', "claude")
    claude_text = first_bytes[0].decode()
    story.expect_rows([path.read_bytes() for path in files] == first_bytes, all(data.endswith(b"\n") and not data.endswith(b"\n\n") for data in first_bytes),
                      claude_text == json.dumps(json.loads(claude_text), indent=2, sort_keys=True) + "\n")


def test_a_broken_person_settings_file_is_shown_in_the_chat_and_carries_nothing(new_story):
    story = new_story(fixture=MainEnvironment)
    claude_person_file().parent.mkdir(parents=True, exist_ok=True)
    claude_person_file().write_text('{"env": {"A": "1"}, broken')
    tick = ProgramSettingsTick()
    tick(story.container)
    tick(story.container)
    story.expect_rows("env" not in claude_settings(story), marks_text(story).count(f"Your settings file {claude_person_file()} could not be read") == 1)
