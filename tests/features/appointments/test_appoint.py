import json
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features
from commands.http import dispatch
from controllers.types import Agents
from engine.record import Record
from engine.sessions import Sessions
from features.appointments.appoint import appoint, online
from resources.base import AGENT
from tests.kit import check, done, refused

features.unload()
features.load()
root = Path(tempfile.mkdtemp()) / ".journal"
main = Record(root, "main")
other = Record(root, "other")
sessions = Sessions(root)
sessions.write("codex-live", environment="main", seen=time.time())
source = Agents(main, actor=AGENT).create("codex-live", provider="codex", model="gpt-6", status="idle", context=42)
seat = {"at": time.time(), "agent": "codex", "state": "idle", "env": "main",
        "report": {"title": "codex-live", "provider": "codex", "model": "gpt-6", "status": "idle", "context": 42,
                   "skills": ["journal"], "shells": 2}}
(root / "runtime" / "seat-codex.json").write_text(json.dumps(seat))

check("only a fresh seat is offered as an online agent", [(a["session"], a["environment"], a["model"]) for a in online(root)], [("codex-live", "main", "gpt-6")])
got = appoint(root, "other", "codex-live")
target = Agents(other).all()[0]
check("appointment moves the session and carries its visible state",
      (got["before"], got["environment"], sessions.environment("codex-live"), target.title, target.provider, target.model,
       target.status, target.skills, target.shells),
      ("main", "other", "other", "codex-live", "codex", "gpt-6", "idle", ["journal"], 2))
check("the environment it left no longer presents the agent as live", Agents(main).load(source.n).status, "stopped")
check("an offline session cannot be appointed", refused(lambda: appoint(root, "main", "gone")), "session 'gone' is not online")
sessions.write("claude-holder", environment="main", seen=time.time())
check("an agent cannot be appointed over an environment's live holder", refused(lambda: appoint(root, "main", "codex-live")), "environment 'main' is taken by session claude-holder")
sessions.unbind("claude-holder")

offered = dispatch("GET", "/api/agents", root, {}, {})
moved = dispatch("POST", "/api/main/appoint", root, {}, {"session": "codex-live"})
check("the viewer API lists and appoints online sessions", (offered.code, offered.body[0]["session"], moved.code, moved.body["environment"]), (200, "codex-live", 200, "main"))

seat["at"] = time.time() - 6
(root / "runtime" / "seat-codex.json").write_text(json.dumps(seat))
check("stale seats disappear from the online list", online(root), [])
check("unknown environments are refused without creating them", refused(lambda: appoint(root, "missing", "codex-live")), "no environment 'missing'")

done()
