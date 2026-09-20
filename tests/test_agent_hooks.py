import json

import pytest
from commands.http import dispatch
from tests.conftest import fresh


@pytest.fixture(scope="module")
def record():
    record = fresh("main")
    project = record.root.parent
    settings = project / ".claude" / "settings.json"
    settings.parent.mkdir()
    settings.write_text(json.dumps({"theme": "dark", "hooks": {"Stop": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}}))
    return record


def test_agent_hooks_are_read_saved_and_validated(record):
    settings = record.root.parent / ".claude" / "settings.json"

    got = dispatch("GET", "/api/agent-hooks/claude", record.root, {}, {})
    assert (got.code, got.body["path"], got.body["hooks"]["Stop"][0]["hooks"][0]["command"]) == \
        (200, ".claude/settings.json", "echo mine"), \
        "the agent's hooks are read from its own settings, with the file named"

    edited = {"Stop": [{"hooks": [{"type": "command", "command": "echo changed"}]}], "PreToolUse": [], "PostToolUse": [{"matcher": "Edit", "hooks": [{"type": "command", "command": "npm run lint"}]}]}
    saved = dispatch("POST", "/api/agent-hooks/claude", record.root, {}, {"hooks": edited})
    written = json.loads(settings.read_text())
    assert (saved.code, sorted(written["hooks"]), written["hooks"]["Stop"][0]["hooks"][0]["command"], written["theme"]) == \
        (200, ["PostToolUse", "Stop"], "echo changed", "dark"), \
        "saving writes the hooks back, drops emptied events and keeps the other settings"

    bad = dispatch("POST", "/api/agent-hooks/claude", record.root, {}, {"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "  "}]}]}})
    assert (bad.code, json.loads(settings.read_text())["hooks"]["Stop"][0]["hooks"][0]["command"]) == (400, "echo changed"), \
        "a hook without a command is refused and nothing is written"


def test_an_unknown_provider_is_not_found(record):
    assert dispatch("GET", "/api/agent-hooks/nobody", record.root, {}, {}).code == 404
