import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features
from commands.http import dispatch
from controllers.types import Agents
from engine.record import Record
from features.usage.usage import codex, options
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
check("Codex plan windows normalize snake and camel case fields", codex(transcript, now), {
    "windows": [
        {"key": "primary", "label": "5h", "remaining": 57.6, "minutes": 300, "resets": now + 3600},
        {"key": "secondary", "label": "7d", "remaining": 19.0, "minutes": 10080, "resets": now + 7200},
    ]
})
check("expired plan windows are not presented as current", codex(transcript, now + 8000), {"windows": []})

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
check("one agent event refreshes both reported windows", [window["remaining"] for window in agents.load(agent.n).usage["windows"]], [56.6, 18.0])

reply = dispatch("GET", "/api/agent-usage/claude", root, {}, {})
check("Claude explains its supported fallback without changing configuration", reply.body, options("claude"))

done()
