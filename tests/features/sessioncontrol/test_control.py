import json
import sys
import tempfile
import time
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from commands.http import dispatch
from engine.drivers import Driver
from engine.engine import Engine
from engine.inputs import take
from engine.record import Record
from engine.sessions import Sessions
from features.sessioncontrol.control import options, request
from providers.codex import Codex
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
          ["opus", "sonnet", "haiku", "claude-fable-5"])
    check("an unknown control is refused", refused(lambda: request(root, "main", "codex-live", "model", "gpt-5")), "codex does not support model 'gpt-5'")
    check("another environment cannot control the session", refused(lambda: request(root, "other", "codex-live", "model", "gpt-5.6-sol")), "session 'codex-live' belongs to environment 'main'")
    check("an offline session cannot be controlled", refused(lambda: request(root, "main", "gone", "picker", "open")), "session 'gone' is not online")

    listed = dispatch("GET", "/api/agent-controls/codex", root, {"model": configuration["model"]}, {})
    posted = dispatch("POST", "/api/main/agent/codex-live/control", root, {}, {"action": "model", "value": "gpt-5.6-luna"})
    check("the viewer API lists and queues controls", (listed.code, listed.body["provider"], posted.code, take(root, "codex-live")["line"]), (200, "codex", 200, "/model"))
    while take(root, "codex-live"):
        pass

    queued = request(root, "main", "codex-live", "effort", "high")
    check("a supported choice queues a control without exposing its CLI command", (queued["provider"], "line" in queued, queued["queued"]), ("codex", False, True))
    driver = FakeCodex(record)
    engine = Engine(record, driver)
    check("the live engine starts the native picker for a choice", (engine.control(), driver.sent), ("controlled: High", ["/model"]))
    check("a control is consumed once per engine tick", (engine.control(), take(root, "codex-live")["line"]), ("", ""))
    while take(root, "codex-live"):
        pass

done()
