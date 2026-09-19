import json
import sys
import tempfile
import time
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from commands.http import dispatch
from controllers.types import Agents, Notices, Notifications
from engine.drivers import Driver
from engine.engine import Engine
from engine.inputs import FORCE, queue, take
from engine.record import Record
from engine.sessions import Sessions
from features.sessioncontrol.control import CARRY_ON, force, options, request
from providers.codex import Codex
from resources.base import SYSTEM
from resources.types import AgentRow
from tests.kit import check, done, refused


class FakeCodex(Driver):
    name = "codex"

    def __init__(self, record):
        super().__init__(record, "codex-live", fd=1)
        self.sent = []

    def command(self, args):
        return ["true"]

    def send(self, text):
        self.sent.append(text)

    def last_report(self):
        return AgentRow(title=self.session, data={"status": "idle", "event": "Stop", "provider": "codex", "at": time.time()})

    def quiet_for(self):
        return 3.0


root = Path(tempfile.mkdtemp()) / ".journal"
record = Record(root, "main")
Record(root, "other")
Sessions(root).write("codex-live", environment="main", seen=time.time())
seat = {"at": time.time(), "agent": "codex", "state": "idle", "env": "main", "report": {"title": "codex-live", "provider": "codex", "model": "gpt-5.6-sol"}}
(root / "runtime" / "seat-codex-live.json").write_text(json.dumps(seat))

models = [
    {
        "slug": "gpt-5.6-sol",
        "display_name": "GPT-5.6-Sol",
        "default_reasoning_level": "medium",
        "supported_reasoning_levels": [{"effort": level} for level in ("low", "medium", "high", "xhigh", "max")],
    },
    {
        "slug": "gpt-5.6-luna",
        "display_name": "GPT-5.6-Luna",
        "default_reasoning_level": "medium",
        "supported_reasoning_levels": [{"effort": level} for level in ("low", "medium", "high", "xhigh")],
    },
]
configuration = {"model": "gpt-5.6-sol", "effort": "xhigh"}
with patch.object(Codex, "catalog", classmethod(lambda cls, path=None: models)), \
        patch.object(Codex, "configuration", classmethod(lambda cls, path=None: configuration)):
    claude = options("claude")
    codex = options("codex", configuration["model"])
    check("Claude and Codex expose model and effort choices",
          ([group["key"] for group in claude["groups"]], [group["key"] for group in codex["groups"]]),
          (["model", "effort"], ["model", "effort"]))
    check("Codex exposes the catalog model labels",
          codex["groups"][0]["choices"],
          [{"value": "gpt-5.6-sol", "label": "GPT-5.6-Sol"}, {"value": "gpt-5.6-luna", "label": "GPT-5.6-Luna"}])
    check("Codex exposes the selected model's efforts",
          [choice["value"] for choice in codex["groups"][1]["choices"]],
          ["low", "medium", "high", "xhigh", "max"])
    check("commands stay server-side", "command" in claude["groups"][0]["choices"][0], False)
    check("Claude exposes Fable in its cloud model picker",
          [choice["value"] for choice in claude["groups"][0]["choices"]],
          ["opus", "sonnet", "haiku", "claude-fable-5-1"])
    check("an unknown control is refused", refused(lambda: request(root, "main", "codex-live", "model", "gpt-5")), "codex does not support model 'gpt-5'")
    check("another environment cannot control the session", refused(lambda: request(root, "other", "codex-live", "model", "gpt-5.6-sol")), "session 'codex-live' belongs to environment 'main'")
    check("an offline session cannot be controlled", refused(lambda: request(root, "main", "gone", "picker", "open")), "session 'gone' is not online")

    listed = dispatch("GET", "/api/agent-controls/codex", root, {"model": configuration["model"]}, {})
    posted = dispatch("POST", "/api/main/agent/codex-live/control", root, {}, {"action": "model", "value": "gpt-5.6-luna"})
    check("the viewer API lists and queues controls", (listed.code, listed.body["provider"], posted.code, take(root, {"codex-live"})["line"]), (200, "codex", 200, "/model"))
    while take(root, {"codex-live"}):
        pass

    queued = request(root, "main", "codex-live", "effort", "high")
    check("a queued choice shows as pending on the agent's row", Agents(record, actor=SYSTEM).by_session("codex-live").pending.get("effort", {}).get("value"), "high")
    check("a supported choice queues a control without exposing its CLI command", (queued["provider"], "line" in queued, queued["queued"]), ("codex", False, True))
    driver = FakeCodex(record)
    engine = Engine(record, driver)
    check("the live engine starts the native picker for a choice", (engine.control(), driver.sent), ("controlled: High", ["/model"]))
    check("once typed, the choice is no longer pending", "effort" in Agents(record, actor=SYSTEM).by_session("codex-live").pending, False)
    announced = [n for n in Notices(record).all() if n.data.get("action") == "effort"]
    check("the queued change was announced over the chat, and the announcement closed once typed", (len(announced), all(n.completed for n in announced), announced[0].title), (1, True, "Setting effort to high — waiting for the agent"))
    check("its delivery is told to the user", [n.title for n in Notifications(record).all()][-1], "Effort set to high")
    check("a control is consumed once per engine tick", (engine.control(), take(root, {"codex-live"})["line"]), ("", ""))
    while take(root, {"codex-live"}):
        pass

    class Supervised(FakeCodex):
        def __init__(self, record):
            super().__init__(record)
            self.session = "codex-4242"

        def last_report(self):
            return AgentRow(title="codex-live", data={"status": "idle", "event": "Stop", "provider": "codex", "at": time.time()})

    request(root, "main", "codex-live", "effort", "high")
    supervised = Supervised(record)
    check("a control queued under the agent's own session reaches the engine that runs it under its terminal name",
          (Engine(record, supervised).control(), supervised.sent), ("controlled: High", ["/model"]))
    queue(root, "codex-live", "/model", "Old", provider="codex")
    for path in (root / "runtime" / "inputs").glob("*.json"):
        path.write_text(json.dumps({**json.loads(path.read_text()), "at": time.time() - 3600}))
    check("a control left waiting for an hour is dropped, not typed late", (take(root, {"codex-live"}), list((root / "runtime" / "inputs").glob("*.json"))), ({}, []))

    class Busy(FakeCodex):
        def __init__(self, record):
            super().__init__(record)
            self.status, self.stopped = "working", 0

        def stop_turn(self):
            self.stopped += 1
            self.status = "idle"

        def last_report(self):
            return AgentRow(title="codex-live", data={"status": self.status, "event": "PreToolUse" if self.status == "working" else "Stop", "provider": "codex", "at": time.time()})

        def quiet_for(self):
            return 0.0 if self.status == "working" else 30.0

        def at_prompt(self):
            return self.status == "idle"

    busy = Busy(record)
    forcing = Engine(record, busy)
    request(root, "main", "codex-live", "effort", "high")
    check("while the agent works, a queued change waits", (forcing.control(), busy.sent), ("", []))
    check("an agent that is not busy is never forced", (Engine(record, Supervised(record)).forced(), busy.stopped), ("", 0))
    force(root, "main", "codex-live")
    check("force stops the turn, and once the prompt is back types the change and tells the agent to carry on, without waiting for an idle report",
          (forcing.forced(), busy.stopped, busy.sent), ("controlled: High", 1, ["/model", CARRY_ON]))
    check("force takes the offline check like any control", refused(lambda: force(root, "main", "gone")), "session 'gone' is not online")
    while take(root, {"codex-live"}) or take(root, {"codex-live"}, FORCE):
        pass

# AN ACTIVE MODEL MISSING FROM THE CATALOG still gets its effort choices, and a choice still reaches the picker
with patch.object(Codex, "configuration", classmethod(lambda cls, path=None: {"model": "gpt-5.6-luna", "effort": "medium"})):
    dated = Codex.controls_for(models, "gpt-5.6-sol-2026-09-01")
    check("a dated id finds its catalog model, and the effort group stays", ([g["key"] for g in dated["groups"]], [c["value"] for c in dated["groups"][1]["choices"]]),
          (["model", "effort"], ["low", "medium", "high", "xhigh", "max"]))
    unknown = Codex.controls_for(models, "something-else")
    check("an unknown id falls back to the configured model's efforts", [g["key"] for g in unknown["groups"]], ["model", "effort"])
    check("an effort choice for an unmatched model still builds the picker's keys", Codex.commands(models, "effort", "high", "something-else", "medium")[0], "/model")

done()
