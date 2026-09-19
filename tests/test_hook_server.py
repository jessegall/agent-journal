import json
import os
import socket
import subprocess
import sys
import threading
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Agents, Nudges  # noqa: E402
from engine.hooks import gate_file  # noqa: E402
from engine.sessions import ACTIVE_ENV  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from serve import serve  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

HERE = Path(__file__).resolve().parents[1]


def run_hook(root: Path, event: str, tool: str = "Read", session: str = "srv-1") -> subprocess.CompletedProcess:
    payload = json.dumps({"hook_event_name": event, "session_id": session, "tool_name": tool, "tool_input": {"file_path": "x"}})
    return subprocess.run(["sh", str(HERE / "hook.sh"), "claude", str(root)], input=payload, capture_output=True, text=True, timeout=60,
                          cwd=root.parent, env={**os.environ, ACTIVE_ENV: "1", "JOURNAL_ENV": "main"})


def point(root: Path, url: str, at: float = 0) -> None:
    (root / "runtime").mkdir(exist_ok=True)
    (root / "runtime" / "heartbeat").write_text(f"{int(at or time.time())} {url}\n")


record = fresh("main")
server = serve(record.root, 0)
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_address[1]}/"
point(record.root, url)
agents = Agents(record, actor=SYSTEM)

# THE SERVER ANSWERS: the hook's row is written in the server, where the features are loaded
p = run_hook(record.root, "Stop")
row = agents.by_session("srv-1")
check("the hook's row is written by the server", (p.returncode, row.status, row.event), (0, "idle", "Stop"))
check("the server's features heard the write", record.events()[-1].heard, True)
time.sleep(2.5)
check("the server keeps its heartbeat fresh", time.time() - int((record.root / "runtime" / "heartbeat").read_text().split()[0]) < 3.5, True)
check("the server knew the agent's parent process", bool(json.loads((record.root / "runtime" / "session-srv-1.json").read_text()).get("pid")), True)

# 200 WITH NOTHING TO SAY prints nothing; 200 WITH A PRIVATE MESSAGE prints it for the agent
p = run_hook(record.root, "PreToolUse")
check("a tool call that may go ahead: nothing printed", (p.returncode, p.stdout), (0, ""))
Nudges(record, actor=SYSTEM).create("a line for the agent only", session="srv-1", private=True)
p = run_hook(record.root, "PostToolUse")
check("a private line rides on a 200 to the agent", "a line for the agent only" in p.stdout, True)

# A REFUSAL is a 403 with its reason, and the script hands the reason to the agent
gate_file(record.root, "main", "srv-1").write_text(json.dumps({"gate": "declare the work first"}))
body = json.dumps({"hook_event_name": "PreToolUse", "session_id": "srv-1", "tool_name": "Edit", "tool_input": {"file_path": "x"}}).encode()
try:
    urlopen(Request(f"{url}api/hook/claude?root={record.root}&pid=1&env=main", data=body, headers={"Content-Type": "application/json"}), timeout=10)
    status = 200
except HTTPError as e:
    status = e.code
check("the server says 403 when it refuses", status, 403)
p = run_hook(record.root, "PreToolUse", tool="Edit")
check("the script passes the refusal on to the agent", (p.returncode, json.loads(p.stdout)["reason"]), (0, "declare the work first"))

# ANOTHER JOURNAL'S SERVER refuses to answer for this record, and the hook lets the tool call go
other = fresh("main")
point(other.root, url)
p = run_hook(other.root, "Stop", session="srv-2")
check("a server for another record writes nothing anywhere", (p.returncode, p.stdout, Agents(other, actor=SYSTEM).all(), [a.title for a in agents.all()]), (0, "", [], ["srv-1"]))

# NO HEARTBEAT: the hook returns at once without asking, and allows
stale = fresh("main")
point(stale.root, url, at=time.time() - 60)
began = time.time()
p = run_hook(stale.root, "PreToolUse", session="srv-3")
check("a heartbeat a minute old: allowed at once, nothing asked or written", (p.returncode, p.stdout, Agents(stale, actor=SYSTEM).all(), time.time() - began < 2), (0, "", [], True))
nothing = fresh("main")
p = run_hook(nothing.root, "Stop", session="srv-4")
check("no viewer ever started: allowed, nothing written", (p.returncode, Agents(nothing, actor=SYSTEM).all()), (0, []))
lonely = fresh("main")
with socket.socket() as s:
    s.bind(("127.0.0.1", 0))
    closed = s.getsockname()[1]
point(lonely.root, f"http://127.0.0.1:{closed}/")
p = run_hook(lonely.root, "Stop", session="srv-5")
check("a fresh heartbeat but nobody listening: allowed", (p.returncode, p.stdout), (0, ""))

# NOT UNDER THE JOURNAL: the script does nothing at all
p = subprocess.run(["sh", str(HERE / "hook.sh"), "claude", str(record.root)], input="{}", capture_output=True, text=True, timeout=30,
                   env={k: v for k, v in os.environ.items() if k != ACTIVE_ENV})
check("an inactive hook returns before asking anyone", (p.returncode, p.stdout), (0, ""))

server.shutdown()
done()
