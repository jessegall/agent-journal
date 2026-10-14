"""The supervisor with a real pty and a real unix socket: keys reach the agent, its output comes back, a typed instruction lands, and the journal process is kept alive. The agent here is a shell script; no Claude runs."""

import json
import os
import socket
import time
from pathlib import Path

from supervisor.inbox import Inbox
from supervisor.journal_process import JournalProcess
from supervisor.launch import Launch
from supervisor.menu import Menu
from supervisor.supervisor import Supervisor
from supervisor.terminal import Terminal


def pump(supervisor: Supervisor, seconds: float) -> None:
    until = time.time() + seconds
    while time.time() < until:
        supervisor.relay_once(0.05)
        supervisor.journal.keep_alive()


def test_the_loop_relays_keys_output_and_typed_lines(tmp_path: Path):
    out_r, out_w = os.pipe()
    in_r, in_w = os.pipe()
    terminal = Terminal(["sh", "-c", "while read line; do echo \"got:$line\"; done"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox(Inbox.path_for(tmp_path))
    journal = JournalProcess(tmp_path, ["sh", "-c", "sleep 30"], {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    supervisor = Supervisor(terminal, inbox, journal, stdin=in_r, stdout=out_w)
    inbox.open()
    journal.start()
    terminal.start()
    try:
        os.write(in_w, b"hello\r")
        pump(supervisor, 0.5)
        with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as link:
            link.sendto(json.dumps({"type": "Type", "line": "from the journal"}).encode(), str(inbox.path))
        pump(supervisor, 0.5)
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


def test_the_menu_defaults_and_answers(tmp_path: Path):
    answers = iter(["", "n", "aside"])
    rows = [{"name": "main", "last_session": "abc", "last_used": "2 hours ago"}, {"name": "spike", "last_session": "", "last_used": ""}]
    menu = Menu(tmp_path, tmp_path / "journal.py", ask=lambda prompt: next(answers), say=lambda line: None)
    menu.environments = lambda: rows
    choice = menu.choose()
    assert choice.environment == "main" and choice.resume == "" and choice.hooks_aside
    assert menu.choose(yes=True) == menu.choose(env="main", new=False, aside=False, yes=True)
    assert menu.choose(yes=True).resume == "abc"
    assert menu.choose(env="spike", yes=True).resume == ""


def test_launch_parses_flags_and_builds_the_commands(tmp_path: Path):
    launch = Launch.parse(["claude", "--env", "spike", "--aside", "--", "--model", "x"], tmp_path)
    assert launch.env == "spike" and launch.aside and launch.args == ("--model", "x")
    from supervisor.menu import Choice
    assert launch.agent_command(Choice("spike", "s-1", True)) == ["claude", "--resume", "s-1", "--model", "x"]
    environ = launch.environ(Choice("spike", "", True))
    assert "AGENT_JOURNAL_ACTIVE" not in environ and environ["JOURNAL_ENV"] == "spike"
    assert launch.environ(Choice("spike", "", False))["AGENT_JOURNAL_ACTIVE"] == "1"
    assert launch.journal_command()[-1] == "serve"
