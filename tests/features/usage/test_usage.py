import json
import subprocess
from pathlib import Path

import pytest

import features
from controllers.types import Agents
from engine.record import Record
from features.usage.usage import observe
from providers.claude import Claude
from providers.codex import Codex
from resources.base import SYSTEM


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_codex_owns_plan_window_extraction_and_the_feature_decides_expiry(tmp_path):
    now = 1_800_000_000
    transcript = tmp_path / "rollout.jsonl"
    limits = {
        "primary": {"used_percent": 42.4, "window_minutes": 300, "resets_at": now + 3600},
        "secondary": {"usedPercent": 81, "windowDurationMins": 10080, "resetsAt": now + 7200},
    }
    transcript.write_text("bad json\n" + json.dumps({"type": "event_msg", "payload": {"type": "token_count", "rate_limits": limits}}) + "\n")
    assert Codex().usage(transcript, now) == {
        "windows": [
            {"key": "primary", "label": "5h", "used": 42.4, "minutes": 300, "resets": now + 3600},
            {"key": "secondary", "label": "7d", "used": 81.0, "minutes": 10080, "resets": now + 7200},
        ]
    }, "Codex owns plan-window extraction and normalizes both field cases"
    assert len(Codex().usage(transcript, now + 8000)["windows"]) == 2, "providers report expired windows as facts"
    assert observe("codex", str(transcript), {}, now + 8000) == {"windows": []}, \
        "the usage feature decides expired windows are not current"


def test_claude_reads_its_plan_windows_from_its_status_line(tmp_path, monkeypatch):
    home = tmp_path / "home"
    home.mkdir()
    monkeypatch.setenv("HOME", str(home))
    assert Claude().usage(Path("/x/abc-1.jsonl")) is None, "Claude with nothing from its status line reports no windows"
    (home / ".journal" / "claude-status").mkdir(parents=True)
    (home / ".journal" / "claude-status" / "abc-1.json").write_text(json.dumps({"session_id": "abc-1", "rate_limits": {
        "five_hour": {"used_percentage": 37.5, "resets_at": 1789900000},
        "seven_day": {"used_percentage": 12, "resets_at": "2026-09-25T10:00:00Z"}}}))
    assert Claude().usage(Path("/x/abc-1.jsonl")) == {"windows": [
        {"key": "five_hour", "label": "5h", "used": 37.5, "minutes": 300, "resets": 1789900000},
        {"key": "seven_day", "label": "7d", "used": 12.0, "minutes": 10080, "resets": 1790330400}]}, \
        "Claude's plan windows come from what its status line was told, in the same shape as Codex's"
    script = Path(__file__).resolve().parents[3] / "claude-status.sh"
    subprocess.run(["sh", str(script)], input=json.dumps({"session_id": "live-2", "rate_limits": {"five_hour": {"used_percentage": 50, "resets_at": 1}}}),
                   text=True, timeout=10, env={"HOME": str(home)})
    assert json.loads((home / ".journal" / "claude-status" / "live-2.json").read_text())["rate_limits"]["five_hour"]["used_percentage"] == 50, \
        "the status-line script keeps what Claude hands it, under the session's name"


def test_wiring_the_status_line_leaves_a_users_own_choice_alone(tmp_path):
    script = Path(__file__).resolve().parents[3] / "claude-status.sh"
    project = tmp_path / "wired"
    project.mkdir()
    Claude().wire(project, f"sh {script.with_name('hook.sh')} claude {project}/.journal")
    assert json.loads((project / ".claude" / "settings.json").read_text())["statusLine"]["command"] == f"sh {script}", \
        "with no status line of its own, the project gets the journal's"
    mine = tmp_path / "mine"
    (mine / ".claude").mkdir(parents=True)
    (mine / ".claude" / "settings.json").write_text(json.dumps({"statusLine": {"type": "command", "command": "my-status"}}))
    Claude().wire(mine, f"sh {script.with_name('hook.sh')} claude {mine}/.journal")
    assert json.loads((mine / ".claude" / "settings.json").read_text())["statusLine"]["command"] == "my-status", \
        "a status line the user set is left alone"


def test_the_feature_stores_and_refreshes_normalized_usage_on_the_agent(tmp_path):
    now = 1_800_000_000
    transcript = tmp_path / "rollout.jsonl"
    limits = {
        "primary": {"used_percent": 42.4, "window_minutes": 300, "resets_at": now + 3600},
        "secondary": {"usedPercent": 81, "windowDurationMins": 10080, "resetsAt": now + 7200},
    }
    transcript.write_text(json.dumps({"type": "event_msg", "payload": {"type": "token_count", "rate_limits": limits}}) + "\n")
    root = tmp_path / ".journal"
    record = Record(root, "main")
    Record(root, "other")
    agents = Agents(record, actor=SYSTEM)
    agent = agents.create("codex-live", provider="codex", transcript=str(transcript))
    agents.update(agent.n, status="idle")
    assert agents.load(agent.n).usage["windows"][0]["label"] == "5h", "the feature stores normalized usage on the agent"

    limits["primary"]["used_percent"] = 43.4
    limits["secondary"]["usedPercent"] = 82
    with transcript.open("a") as out:
        out.write(json.dumps({"type": "event_msg", "payload": {"type": "token_count", "rate_limits": limits}}) + "\n")
    agents.update(agent.n, status="working")
    assert [window["used"] for window in agents.load(agent.n).usage["windows"]] == [43.4, 82.0], \
        "one agent event refreshes both reported windows"
