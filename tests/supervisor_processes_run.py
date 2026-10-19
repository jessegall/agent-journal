# Starts real processes, a pty and a unix socket, so it is not in the default run: python3 -m pytest -q tests/supervisor_processes_run.py, before any commit that touches src/supervisor.
"""The supervisor with a real pty and real processes: keys reach the agent, its output comes back, a request lands, and a service is kept alive, restarted less often as it keeps dying, and stopped with every process it started. The agent here is a shell script; no Claude runs."""

import json
import os
import select
import socket
import stat
import time
from pathlib import Path

from supervisor.inbox import Inbox
from supervisor.service import Service
from supervisor.services import Services
from supervisor.supervisor import Supervisor
from supervisor.terminal import Terminal


def pump(supervisor: Supervisor, seconds: float) -> None:
    until = time.time() + seconds
    while time.time() < until:
        supervisor.relay_once(0.05)
        supervisor.services.keep_alive()


def ask(supervisor: Supervisor, **request) -> dict:
    """One request to the supervisor's inbox, answered while the loop turns once."""
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as link:
        link.connect(str(supervisor.inbox.path))
        link.sendall((json.dumps(request) + "\n").encode())
        supervisor.relay_once(0.2)
        return json.loads(link.makefile("rb").readline())


def test_the_loop_relays_keys_output_and_typed_lines(tmp_path: Path):
    out_r, out_w = os.pipe()
    in_r, in_w = os.pipe()
    terminal = Terminal(["sh", "-c", "while read line; do echo \"got:$line\"; done"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"test-{os.getpid()}.sock", tmp_path / "inboxes" / "main")
    journal = Service("journal", ["sh", "-c", "sleep 30"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    supervisor = Supervisor(terminal, inbox, Services(journal), stdin=in_r, stdout=out_w)
    inbox.open()
    journal.start()
    terminal.start()
    try:
        os.write(in_w, b"hello\r")
        pump(supervisor, 0.5)
        assert ask(supervisor, verb="type", name="agent", line="from the journal") == {"ok": True}
        pump(supervisor, 1.0)
        seen = os.read(out_r, 65536).decode()
        assert "got:hello" in seen and "got:from the journal" in seen
        assert journal.alive()
        pid = journal._process.pid
        journal._process.terminate()
        journal._process.wait()
        journal._last_start = 0
        pump(supervisor, 0.3)
        assert journal.alive() and journal._process.pid != pid, "a dead journal is started again"
    finally:
        supervisor.stop()
        journal.stop()
        inbox.close()


def test_a_typed_line_can_wait_before_it_goes_in(tmp_path: Path):
    out_r, out_w = os.pipe()
    in_r, in_w = os.pipe()
    terminal = Terminal(["sh", "-c", "while read line; do echo \"got:$line\"; done"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"test-{os.getpid()}.sock", tmp_path / "inboxes" / "main")
    journal = Service("journal", ["sh", "-c", "sleep 30"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    supervisor = Supervisor(terminal, inbox, Services(journal), stdin=in_r, stdout=out_w)
    inbox.open()
    journal.start()
    terminal.start()
    try:
        ask(supervisor, verb="type", name="agent", line="now")
        ask(supervisor, verb="type", name="agent", line="later", after=0.8)
        pump(supervisor, 0.6)
        seen = os.read(out_r, 65536).decode()
        assert "got:now" in seen and "later" not in seen, "the line with a delay has not gone in yet; lines go in the order they were sent"
        pump(supervisor, 1.0)
        assert "got:later" in os.read(out_r, 65536).decode()
    finally:
        supervisor.stop()
        journal.stop()
        inbox.close()


def test_the_inbox_answers_each_request_and_a_stop_ends_the_supervisor_and_takes_its_inbox_down(tmp_path: Path):
    out_r, out_w = os.pipe()
    terminal = Terminal(["sh", "-c", "trap '' TERM; while true; do sleep 1; done"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"test-{os.getpid()}.sock", tmp_path / "inboxes" / "main")
    journal = Service("journal", ["sh", "-c", "sleep 30"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    supervisor = Supervisor(terminal, inbox, Services(journal), stdin=None, stdout=out_w)
    inbox.open()
    journal.start()
    terminal.start()
    try:
        assert json.loads(inbox.announced_at.read_text()) == {"socket": str(inbox.path), "protocol": 1}
        assert stat.S_IMODE(inbox.path.stat().st_mode) == 0o600 and stat.S_IMODE(inbox.path.parent.stat().st_mode) == 0o700, "only its user can reach the socket"
        assert ask(supervisor, verb="hello") == {"ok": True, "protocol": 1, "verbs": ["hello", "start", "stop", "restart", "list", "keys", "type", "send", "band"]}
        assert ask(supervisor, verb="band", left="agent-journal", middle="p · main", right="http://127.0.0.1:8420/") == {"ok": True}, "a supervisor with no band takes new words and shows none"
        sleeper = {"verb": "start", "name": "sleeper", "command": ["sh", "-c", "sleep 30"], "folder": str(tmp_path), "log": str(tmp_path / "sleeper.log")}
        assert ask(supervisor, **sleeper) == {"ok": True, "started": True}
        assert ask(supervisor, **sleeper) == {"ok": True, "started": False}, "a name already running is left as it is"
        listed = {p["name"]: p for p in ask(supervisor, verb="list")["processes"]}
        assert listed["agent"]["front"] and listed["agent"]["terminal"] and listed["journal"]["running"] and listed["sleeper"]["running"] and listed["sleeper"]["pid"] > 0
        echo = {"verb": "start", "name": "echo", "command": ["sh", "-c", "read line; echo \"heard:$line\""], "folder": str(tmp_path), "log": str(tmp_path / "echo.log")}
        ask(supervisor, **echo)
        assert ask(supervisor, verb="send", name="echo", data="hello\n") == {"ok": True}
        began = time.time()
        while "heard:hello" not in (tmp_path / "echo.log").read_text() and time.time() - began < 3:
            time.sleep(0.05)
        assert "heard:hello" in (tmp_path / "echo.log").read_text(), "send carries text to a process's input"
        pid = listed["sleeper"]["pid"]
        ask(supervisor, verb="restart", name="sleeper")
        assert {p["name"]: p for p in ask(supervisor, verb="list")["processes"]}["sleeper"]["pid"] not in (0, pid)
        assert ask(supervisor, verb="stop", name="sleeper") == {"ok": True}
        assert "sleeper" not in {p["name"] for p in ask(supervisor, verb="list")["processes"]}
        assert ask(supervisor, verb="restart", name="nobody") == {"ok": False, "error": "no process is named 'nobody'"}
        assert ask(supervisor, verb="dance") == {"ok": False, "error": "unknown verb 'dance': hello names the verbs this supervisor takes"}
        assert ask(supervisor, verb="type", name="nobody", line="x") == {"ok": False, "error": "no terminal process is named 'nobody'"}
        assert ask(supervisor, verb="type", line="x") == {"ok": False, "error": "type needs 'name'"}
        assert supervisor._code is None, "a request it cannot carry out is answered and the supervisor stays up"
        ask(supervisor, verb="stop", name="agent")
        began = time.time()
        while supervisor._code is None and time.time() - began < 8:
            supervisor.relay_once(0.05)
        assert supervisor._code is not None, "an agent that ignores TERM is still ended"
        assert terminal.exited() is None, "reaped once, never asked after again"
    finally:
        journal.stop()
        inbox.close()
    assert not inbox.announced_at.exists()


def test_a_typed_lines_enter_waits_until_the_line_has_gone_in(tmp_path: Path):
    from supervisor import terminal as terminal_module
    read_end, write_end = os.pipe()
    terminal = Terminal(["sh"], str(tmp_path), {})
    terminal.fd = write_end
    os.set_blocking(write_end, False)
    filled = 0
    while True:
        try:
            filled += os.write(write_end, b"x" * 65536)
        except BlockingIOError:
            break
    terminal.write(b"k")
    terminal.type("from the journal")
    terminal.pump()
    terminal.feed()
    time.sleep(terminal_module.ENTER_AFTER + 0.1)
    terminal.pump()
    assert terminal._enter_due == 0.0 and not any(piece == b"\r" for piece, _ in terminal._pieces), "the line has not gone in: no Enter yet"
    os.read(read_end, filled)
    terminal.feed()
    terminal.feed()
    assert os.read(read_end, 1024) == b"kfrom the journal", "the key and the line, each in a write of its own, and no Enter in the same piece"
    terminal.pump()
    assert not terminal.has_pending, "the Enter waits a moment after the line is in"
    time.sleep(terminal_module.ENTER_AFTER + 0.1)
    terminal.pump()
    terminal.feed()
    assert os.read(read_end, 1024) == b"\r"
    os.close(read_end)
    os.close(write_end)


def test_a_service_that_keeps_dying_is_started_again_less_often_and_never_left_down(tmp_path: Path, monkeypatch):
    import supervisor.service as service
    monkeypatch.setattr(service, "BACKOFF", 0.05)
    monkeypatch.setattr(service, "LONGEST_WAIT", 0.2)
    crashing = Service("crashing", ["sh", "-c", "exit 1"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "crash.log")
    crashing.start()
    began = time.time()
    while crashing.described()["restarts"] < 8 and time.time() - began < 5:
        crashing.keep_alive()
        time.sleep(0.02)
    assert crashing.described()["restarts"] >= 8, "a kept service is started again however often it dies"
    once = Service("once", ["true"], tmp_path, {}, tmp_path / "once.log", keep=False)
    once.start()
    time.sleep(0.2)
    once.keep_alive()
    assert once.described()["restarts"] == 0, "a process not kept is left down when it ends"


def test_stopping_a_service_ends_every_process_it_started(tmp_path: Path):
    family = Service("family", ["sh", "-c", "sleep 30 & sleep 30"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "family.log")
    family.start()
    time.sleep(0.2)
    group = family._process.pid
    family.stop()
    try:
        os.killpg(group, 0)
        alive = True
    except ProcessLookupError:
        alive = False
    assert not alive, "the child it left in the background went with it"


def test_a_restart_replaces_only_the_resume_and_keeps_the_rest_of_the_command(tmp_path: Path):
    terminal = Terminal(["env", "KEPT=yes", "sh", "-c", "echo seen:$KEPT:$RESUMED; sleep 5"], str(tmp_path), {"PATH": os.environ["PATH"]}, ("RESUMED=first",))

    def output(until: bytes) -> bytes:
        seen, began = b"", time.time()
        while until not in seen and time.time() - began < 3:
            seen += terminal.read() if select.select([terminal.fd], [], [], 0.1)[0] else b""
        return seen

    terminal.start()
    assert b"seen:yes:first" in output(b"seen:")
    terminal.restart(("RESUMED=second",))
    seen = output(b"seen:")
    terminal.stop(1.0)
    assert b"seen:yes:second" in seen, "the restart put its own resume after the program and kept the rest of the command"


def test_an_agent_that_dies_is_started_again_and_one_that_quits_ends_the_supervisor(tmp_path: Path):
    marker = tmp_path / "died once"
    terminal = Terminal(["sh", "-c", f'test -f "{marker}" || {{ touch "{marker}"; exit 1; }}; sleep 60'], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"revive-{os.getpid()}.sock", tmp_path / "inboxes" / "main")
    journal = Service("journal", ["sh", "-c", "sleep 60"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    keys, _ = os.pipe()
    supervisor = Supervisor(terminal, inbox, Services(journal), stdin=keys, stdout=os.open(os.devnull, os.O_WRONLY))
    inbox.open()
    journal.start()
    terminal.start()
    try:
        until = time.time() + 5
        while time.time() < until and not (marker.exists() and terminal.pid > 0 and supervisor._revivals):
            supervisor.relay_once(0.05)
        pump(supervisor, 0.5)
        front = supervisor.described()[0]
        assert supervisor._code is None and front["running"] and front["restarts"] == 1 and journal.alive(), "the agent died, was started again, and the journal kept running"
    finally:
        supervisor.stop()
        supervisor.services.stop_all()
        inbox.close()
    quitting = Terminal(["sh", "-c", "exit 0"], str(tmp_path), {"PATH": os.environ["PATH"]})
    quits = Supervisor(quitting, Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"quit-{os.getpid()}.sock", tmp_path / "inboxes" / "other"), Services(Service("journal", ["sh", "-c", "sleep 60"], tmp_path, {"PATH": os.environ["PATH"]}, tmp_path / "s.log")), stdin=keys, stdout=os.open(os.devnull, os.O_WRONLY))
    quits.inbox.open()
    quitting.start()
    try:
        until = time.time() + 5
        while time.time() < until and quits._code is None:
            quits.relay_once(0.05)
        assert quits._code == 0, "a clean exit ends the supervisor"
    finally:
        quits.inbox.close()
