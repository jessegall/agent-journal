import json
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from commands.http import dispatch
from engine.drivers import Driver
from engine.engine import Engine
from engine.inputs import take
from engine.record import Record
from engine.sessions import Sessions
from features.sessioncontrol.control import options, request
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

claude = options("claude")
codex = options("codex")
check("Claude and Codex offer direct model choices",
      ([group["key"] for group in claude["groups"]], codex["groups"][0]["choices"][:1]),
      (["model", "effort"], [{"value": "gpt-5.3-codex", "label": "GPT-5.3 Codex"}]))
check("commands stay server-side", "command" in claude["groups"][0]["choices"][0], False)
check("an unknown control is refused", refused(lambda: request(root, "main", "codex-live", "model", "gpt-5")), "codex does not support model 'gpt-5'")
check("another environment cannot control the session", refused(lambda: request(root, "other", "codex-live", "model", "gpt-5.3-codex")), "session 'codex-live' belongs to environment 'main'")
check("an offline session cannot be controlled", refused(lambda: request(root, "main", "gone", "picker", "open")), "session 'gone' is not online")

listed = dispatch("GET", "/api/agent-controls/codex", root, {}, {})
posted = dispatch("POST", "/api/main/agent/codex-live/control", root, {}, {"action": "model", "value": "gpt-5.3-codex"})
check("the viewer API lists and queues controls", (listed.code, listed.body["provider"], posted.code, take(root, "codex-live")["line"]), (200, "codex", 200, "/model gpt-5.3-codex"))

queued = request(root, "main", "codex-live", "model", "gpt-5.3-codex")
check("a supported choice queues a control without exposing its CLI command", (queued["provider"], "line" in queued, queued["queued"]), ("codex", False, True))
driver = FakeCodex(record)
engine = Engine(record, driver)
check("the live engine types one queued control into its own CLI", (engine.control(), driver.sent), ("controlled: GPT-5.3 Codex", ["/model gpt-5.3-codex"]))
check("a control is consumed once", (engine.control(), take(root, "codex-live")), ("", {}))

done()
