import json
from pathlib import Path

import pytest

from engine.enums.hook_trust import HookTrust
from core.modules.codex.providers.support.codex_trust import CodexTrust

FIXTURES = Path(__file__).parent.parent / "fixtures"
HOOK_NAMES = ["SessionStart", "PreToolUse", "Stop"]


@pytest.fixture
def trusted_hooks(tmp_path):
    hooks = tmp_path / "project" / ".codex" / "hooks.json"
    hooks.parent.mkdir(parents=True)
    hooks.write_text((FIXTURES / "hooks.json").read_text())
    config = tmp_path / "config.toml"
    config.write_text((FIXTURES / "trusted_hooks.toml").read_text().replace("/work/app/.codex/hooks.json", str(hooks)))
    return hooks, config


def test_current_codex_hash_fixtures_are_ready_without_an_enabled_field(trusted_hooks):
    hooks, config = trusted_hooks
    assert CodexTrust(config).trust(hooks, HOOK_NAMES) is HookTrust.READY


@pytest.mark.parametrize("entry", [{}, {"enabled": True}, {"enabled": False}, {"trusted_hash": "sha256:old"}])
def test_missing_or_stale_hashes_cannot_make_hooks_ready(trusted_hooks, entry):
    hooks, config = trusted_hooks
    config.write_text("\n".join(CodexTrust.state_table(f"{hooks}:{name}:0:0", entry) for name in ("session_start", "pre_tool_use", "stop")))
    expected = HookTrust.CHANGED if "trusted_hash" in entry else HookTrust.UNTRUSTED
    assert CodexTrust(config).trust(hooks, HOOK_NAMES) is expected


@pytest.mark.parametrize(("field", "value"), [("command", "journal-hook codex /work/other"), ("timeout", 12), ("async", True),
                                              ("statusMessage", "Checking"), ("additionalContextLimit", 0)])
def test_a_changed_definition_requires_review(trusted_hooks, field, value):
    hooks, config = trusted_hooks
    settings = json.loads(hooks.read_text())
    settings["hooks"]["PreToolUse"][0]["hooks"][0][field] = value
    hooks.write_text(json.dumps(settings))
    assert CodexTrust(config).trust(hooks, HOOK_NAMES) is HookTrust.CHANGED


def test_a_changed_matcher_requires_review(trusted_hooks):
    hooks, config = trusted_hooks
    settings = json.loads(hooks.read_text())
    settings["hooks"]["PreToolUse"][0]["matcher"] = "read_file"
    hooks.write_text(json.dumps(settings))
    assert CodexTrust(config).trust(hooks, HOOK_NAMES) is HookTrust.CHANGED


def test_a_disabled_hook_is_not_ready(trusted_hooks):
    hooks, config = trusted_hooks
    config.write_text(config.read_text() + '\nenabled = false\n')
    assert CodexTrust(config).trust(hooks, HOOK_NAMES) is HookTrust.CHANGED


def test_another_trusted_hook_in_the_same_event_does_not_trust_the_journal_hook(trusted_hooks):
    hooks, config = trusted_hooks
    settings = json.loads(hooks.read_text())
    settings["hooks"]["PreToolUse"][0]["hooks"].insert(0, {"type": "command", "command": "echo unrelated", "timeout": 90})
    hooks.write_text(json.dumps(settings))
    assert CodexTrust(config).trust(hooks, HOOK_NAMES) is HookTrust.CHANGED


def test_equivalent_defaults_and_formatting_keep_the_same_hash(trusted_hooks):
    hooks, config = trusted_hooks
    settings = json.loads(hooks.read_text())
    for event in settings["hooks"].values():
        event[0]["hooks"][0]["async"] = False
        event[0]["hooks"][0]["additionalContextLimit"] = 2500
    settings["hooks"]["Stop"][0]["matcher"] = "ignored"
    hooks.write_text(json.dumps(settings, indent=4))
    assert CodexTrust(config).trust(hooks, HOOK_NAMES) is HookTrust.READY
