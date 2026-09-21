import json
import os
import socket
import subprocess
import tempfile
import threading
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from controllers.types import Agents, Nudges
from engine import bus
from engine.hooks import alongside, gate_file
from engine.sessions import ACTIVE_ENV
from resources.base import SYSTEM
from serve import serve
from tests.conftest import fresh

HERE = Path(__file__).resolve().parents[1]


def run_hook(root, event, tool="Read", session="srv-1", inbox=""):
    payload = json.dumps({"hook_event_name": event, "session_id": session, "tool_name": tool, "tool_input": {"file_path": "x"}})
    return subprocess.run(["sh", str(HERE / "hook.sh"), "claude", str(root)], input=payload, capture_output=True, text=True, timeout=60,
                          cwd=root.parent, env={**os.environ, ACTIVE_ENV: "1", "JOURNAL_ENV": "main", "CLAUDE_CODE_MESSAGING_SOCKET": inbox})


def point(root, url, at=0):
    (root / "runtime").mkdir(exist_ok=True)
    (root / "runtime" / "heartbeat").write_text(f"{int(at or time.time())} {url}\n")


def test_the_running_server_answers_hooks_over_http():
    record = fresh("main")
    server = serve(record.root, 0)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        url = f"http://127.0.0.1:{server.server_address[1]}/"
        point(record.root, url)
        agents = Agents(record, actor=SYSTEM)

        p = run_hook(record.root, "Stop")
        row = agents.by_session("srv-1")
        assert (p.returncode, row.status, row.event) == (0, "idle", "Stop"), "the hook's row is written by the server"
        assert record.events()[-1].heard is True, "the server's features heard the write"
        run_hook(record.root, "SubagentStop")
        assert agents.by_session("srv-1").status == "idle", "a subagent stopping does not put the agent back to work"
        run_hook(record.root, "PreToolUse")
        run_hook(record.root, "SubagentStart")
        assert agents.by_session("srv-1").status == "working", "nor does one starting take it off work"

        where = Path(tempfile.mkdtemp()) / "inbox.sock"
        listener = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        listener.bind(str(where))
        listener.listen(1)
        run_hook(record.root, "PreToolUse", inbox=str(where))
        assert agents.by_session("srv-1").inbox == str(where), "the row carries the socket the session named"
        listener.close()
        where.unlink()
        run_hook(record.root, "PreToolUse", inbox=str(where))
        assert agents.by_session("srv-1").inbox == str(where), \
            "a path that is no longer a socket is not taken, and the last known one stays"

        ran = []
        off = bus.on("agent.updated", lambda e, r: time.sleep(1) or ran.append(e.id))
        try:
            before = record.last_event()
            began = time.time()
            run_hook(record.root, "PreToolUse")
            took = time.time() - began
            hooked = next(e.id for e in record.events(before) if e.type == "agent" and e.action == "updated")
            assert took < 0.9, "the hook is answered without waiting on a slow feature"
            time.sleep(1.5)
            assert hooked in ran, "the feature still ran on the hook's own write, after the reply"
            time.sleep(2.5)
            assert time.time() - int((record.root / "runtime" / "heartbeat").read_text().split()[0]) < 3.5, \
                "the server keeps its heartbeat fresh"
            assert bool(json.loads((record.root / "runtime" / "session-srv-1.json").read_text()).get("pid")) is True, \
                "the server knew the agent's parent process"
        finally:
            off()

        p = run_hook(record.root, "PreToolUse")
        assert (p.returncode, p.stdout) == (0, ""), "a tool call that may go ahead: nothing printed"
        Nudges(record, actor=SYSTEM).create("a line for the agent only", session="srv-1", private=True)
        p = run_hook(record.root, "PostToolUse")
        assert "a line for the agent only" in p.stdout, "a private line rides on a 200 to the agent"

        gate_file(record.root, "main", "srv-1").write_text(json.dumps({"gate": "declare the work first"}))
        body = json.dumps({"hook_event_name": "PreToolUse", "session_id": "srv-1", "tool_name": "Edit", "tool_input": {"file_path": "x"}}).encode()
        try:
            urlopen(Request(f"{url}api/hook/claude?root={record.root}&pid=1&env=main", data=body, headers={"Content-Type": "application/json"}), timeout=10)
            status = 200
        except HTTPError as e:
            status = e.code
        assert status == 403, "the server says 403 when it refuses"
        p = run_hook(record.root, "PreToolUse", tool="Edit")
        assert (p.returncode, json.loads(p.stdout)["reason"]) == (0, "declare the work first"), \
            "the script passes the refusal on to the agent"

        other = fresh("main")
        point(other.root, url)
        p = run_hook(other.root, "Stop", session="srv-2")
        assert (p.returncode, p.stdout, Agents(other, actor=SYSTEM).all(), [a.title for a in agents.all()]) == \
            (0, "", [], ["srv-1"]), "a server for another record writes nothing anywhere"

        stale = fresh("main")
        point(stale.root, url, at=time.time() - 60)
        began = time.time()
        p = run_hook(stale.root, "PreToolUse", session="srv-3")
        assert (p.returncode, p.stdout, Agents(stale, actor=SYSTEM).all(), time.time() - began < 2) == (0, "", [], True), \
            "a heartbeat a minute old: allowed at once, nothing asked or written"
        nothing = fresh("main")
        p = run_hook(nothing.root, "Stop", session="srv-4")
        assert (p.returncode, Agents(nothing, actor=SYSTEM).all()) == (0, []), "no viewer ever started: allowed, nothing written"
        lonely = fresh("main")
        with socket.socket() as s:
            s.bind(("127.0.0.1", 0))
            closed = s.getsockname()[1]
        point(lonely.root, f"http://127.0.0.1:{closed}/")
        p = run_hook(lonely.root, "Stop", session="srv-5")
        assert (p.returncode, p.stdout) == (0, ""), "a fresh heartbeat but nobody listening: allowed"

        p = subprocess.run(["sh", str(HERE / "hook.sh"), "claude", str(record.root)], input="{}", capture_output=True, text=True, timeout=30,
                           env={k: v for k, v in os.environ.items() if k != ACTIVE_ENV})
        assert (p.returncode, p.stdout) == (0, ""), "an inactive hook returns before asking anyone"

        class Line:
            def __init__(self, command):
                self.command = command

        assert alongside(Line('git commit -m x && journal todo done 5 --how "done"')).endswith('journal todo done 5 --how "done"') is True, \
            "a journal command sharing the line with a refused write is named"
        assert alongside(Line('cd x && journal work log "a" ; journal todo create "b"')).endswith('journal work log "a"; journal todo create "b"') is True, \
            "every one of them is named, in the order they were written"
        assert (alongside(Line("echo hi")), alongside(Line(""))) == ("", ""), "a line with no journal command on it says nothing extra"
    finally:
        server.shutdown()
