import json
import os
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import features  # noqa: E402
from engine import bus  # noqa: E402
from engine.hooks import gate_file  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.seats import engine_on  # noqa: E402
from engine.sessions import ACTIVE_ENV  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

HERE = Path(__file__).resolve().parents[1]


def hook(root: Path, event: str = "Stop") -> subprocess.CompletedProcess:
    payload = json.dumps({"hook_event_name": event, "session_id": "fast-1", "tool_name": "Read", "tool_input": {"file_path": "x"}})
    return subprocess.run([sys.executable, str(HERE / "hook.py"), "claude", str(root)], input=payload, capture_output=True, text=True, timeout=60,
                          cwd=root.parent, env={**os.environ, ACTIVE_ENV: "1", "JOURNAL_ENV": "main"})


def seat(root: Path, env: str, at: float) -> None:
    (root / "runtime").mkdir(exist_ok=True)
    (root / "runtime" / "seat-claude-1.json").write_text(json.dumps({"at": at, "env": env, "report": {"title": "fast-1"}}))


# NO ENGINE: the hook runs the features on its own write, as before
record = fresh("main")
check("no seat: no engine is on", engine_on(record.root, "main"), False)
hook(record.root)
check("with no engine, the hook's event is heard where it was written", record.events()[-1].heard, True)

# AN ENGINE ON THIS ENVIRONMENT: the hook only writes, and leaves the event for the engine
record = fresh("main")
seat(record.root, "main", time.time())
check("a fresh seat on this environment: the engine is on", engine_on(record.root, "main"), True)
hook(record.root)
last = record.events()[-1]
check("the hook's event is left unheard for the engine to relay", (last.type, last.heard), ("agent", False))

# THE ENGINE RELAYS IT: an unheard event reaches the features in the engine's process
features.unload()
features.load()
heard = []
bus.on("agent.updated", lambda e, r: heard.append(e.id))
for e in record.events():
    if not e.heard:
        bus.emit(e, Record(record.root, "main"))
check("replayed where the features are loaded, the event reaches them", last.id in heard, True)

# REFUSALS STILL HAPPEN IN THE HOOK, engine or not
seat(record.root, "main", time.time())
gate_file(record.root, "main", "fast-1").write_text(json.dumps({"gate": "declare the work first"}))
payload = json.dumps({"hook_event_name": "PreToolUse", "session_id": "fast-1", "tool_name": "Edit", "tool_input": {"file_path": "x"}})
p = subprocess.run([sys.executable, str(HERE / "hook.py"), "claude", str(record.root)], input=payload, capture_output=True, text=True, timeout=60,
                   cwd=record.root.parent, env={**os.environ, ACTIVE_ENV: "1", "JOURNAL_ENV": "main"})
check("with the engine on, a held write is still refused by the hook", json.loads(p.stdout or "{}").get("reason"), "declare the work first")

# A STALE SEAT, OR ONE ON ANOTHER ENVIRONMENT, IS NO ENGINE HERE
record = fresh("main")
seat(record.root, "main", time.time() - 60)
check("a seat a minute old: no engine", engine_on(record.root, "main"), False)
seat(record.root, "other", time.time())
check("an engine on another environment does not count", engine_on(record.root, "main"), False)

done()
