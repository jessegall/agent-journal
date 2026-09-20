import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features
from commands.http import dispatch
from controllers.types import Agents
from engine.record import Record
from features.statusline.usage import observe
from providers.claude import Claude
from providers.codex import Codex
from resources.base import SYSTEM
from tests.kit import check, done

now = 1_800_000_000
folder = Path(tempfile.mkdtemp())
transcript = folder / "rollout.jsonl"
limits = {
    "primary": {"used_percent": 42.4, "window_minutes": 300, "resets_at": now + 3600},
    "secondary": {"usedPercent": 81, "windowDurationMins": 10080, "resetsAt": now + 7200},
}
transcript.write_text("bad json\n" + json.dumps({"type": "event_msg", "payload": {"type": "token_count", "rate_limits": limits}}) + "\n")
check("Codex owns plan-window extraction and normalizes both field cases", Codex().usage(transcript, now), {
    "windows": [
        {"key": "primary", "label": "5h", "used": 42.4, "minutes": 300, "resets": now + 3600},
        {"key": "secondary", "label": "7d", "used": 81.0, "minutes": 10080, "resets": now + 7200},
    ]
})
check("providers report expired windows as facts", len(Codex().usage(transcript, now + 8000)["windows"]), 2)
check("the usage feature decides expired windows are not current", observe("codex", str(transcript), {}, now + 8000), {"windows": []})
home = Path(tempfile.mkdtemp())
os.environ["HOME"] = str(home)
check("Claude with nothing from its status line reports no windows", Claude().usage(Path("/x/abc-1.jsonl")), None)
(home / ".journal" / "claude-status").mkdir(parents=True)
(home / ".journal" / "claude-status" / "abc-1.json").write_text(json.dumps({"session_id": "abc-1", "rate_limits": {
    "five_hour": {"used_percentage": 37.5, "resets_at": 1789900000},
    "seven_day": {"used_percentage": 12, "resets_at": "2026-09-25T10:00:00Z"}}}))
check("Claude's plan windows come from what its status line was told, in the same shape as Codex's",
      Claude().usage(Path("/x/abc-1.jsonl")), {"windows": [
          {"key": "five_hour", "label": "5h", "used": 37.5, "minutes": 300, "resets": 1789900000},
          {"key": "seven_day", "label": "7d", "used": 12.0, "minutes": 10080, "resets": 1790330400}]})
script = Path(__file__).resolve().parents[3] / "claude-status.sh"
subprocess.run(["sh", str(script)], input=json.dumps({"session_id": "live-2", "rate_limits": {"five_hour": {"used_percentage": 50, "resets_at": 1}}}), text=True, timeout=10, env={**os.environ})
check("the status-line script keeps what Claude hands it, under the session's name", json.loads((home / ".journal" / "claude-status" / "live-2.json").read_text())["rate_limits"]["five_hour"]["used_percentage"], 50)
project = Path(tempfile.mkdtemp())
Claude().wire(project, f"sh {script.with_name('hook.sh')} claude {project}/.journal")
check("with no status line of its own, the project gets the journal's", json.loads((project / ".claude" / "settings.json").read_text())["statusLine"]["command"], f"sh {script}")
mine = Path(tempfile.mkdtemp())
(mine / ".claude").mkdir()
(mine / ".claude" / "settings.json").write_text(json.dumps({"statusLine": {"type": "command", "command": "my-status"}}))
Claude().wire(mine, f"sh {script.with_name('hook.sh')} claude {mine}/.journal")
check("a status line the user set is left alone", json.loads((mine / ".claude" / "settings.json").read_text())["statusLine"]["command"], "my-status")

root = folder / ".journal"
record = Record(root, "main")
Record(root, "other")
agents = Agents(record, actor=SYSTEM)
agent = agents.create("codex-live", provider="codex", transcript=str(transcript))
features.load()
agents.update(agent.n, status="idle")
check("the feature stores normalized usage on the agent", agents.load(agent.n).usage["windows"][0]["label"], "5h")

limits["primary"]["used_percent"] = 43.4
limits["secondary"]["usedPercent"] = 82
with transcript.open("a") as out:
    out.write(json.dumps({"type": "event_msg", "payload": {"type": "token_count", "rate_limits": limits}}) + "\n")
agents.update(agent.n, status="working")
check("one agent event refreshes both reported windows", [window["used"] for window in agents.load(agent.n).usage["windows"]], [43.4, 82.0])

done()
