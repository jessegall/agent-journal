"""The supervisor with a real pty and a real unix socket: keys reach the agent, its output comes back, a typed instruction lands, and the journal process is kept alive. The agent here is a shell script; no Claude runs."""

import json
import os
import socket
import time
from pathlib import Path

from supervisor.inbox import Inbox
from supervisor.journal_process import JournalProcess
from supervisor.launch import Launch
from supervisor.choice import Choice
from supervisor.menu import Menu
from supervisor.screen import Screen
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
    inbox = Inbox.for_(tmp_path, "main")
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


ROWS = [{"name": "main", "last_session": "abc", "last_used": "2 hours ago", "working": True}, {"name": "spike", "last_session": "", "last_used": "", "working": False}]
OTHER = {"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "say done"}]}]}, "model": "opus"}


def settings_with_other_hooks(root: Path) -> Path:
    path = root / ".claude" / "settings.json"
    path.parent.mkdir(parents=True)
    ours = {"hooks": [{"type": "command", "command": "sh /pkg/journal/hooks/hook.sh claude /p"}]}
    path.write_text(json.dumps({**OTHER, "hooks": {**OTHER["hooks"], "PreToolUse": [ours]}}))
    return path


def menu_answering(tmp_path: Path, monkeypatch, answers: list[str]) -> Menu:
    import io
    given = iter(answers)
    monkeypatch.setattr("builtins.input", lambda: next(given))
    menu = Menu(tmp_path, tmp_path / "journal.py", Screen(io.StringIO()))
    menu.environments = lambda: ROWS
    return menu


def test_the_menu_defaults_and_answers_and_remembers(tmp_path: Path, monkeypatch):
    settings_with_other_hooks(tmp_path)
    menu = menu_answering(tmp_path, monkeypatch, ["", "2", "1", "2"])
    assert menu.choose("claude") == Choice("main", "", hooks_aside=False, skip_prompts=True)
    assert menu.choose("claude", yes=True) == Choice("main", "abc", hooks_aside=False, skip_prompts=True), "yes takes the defaults, which are last time's answers"
    assert menu.choose("claude", env="spike", yes=True).resume == ""
    assert menu.choose("claude", env="spike", new=True, aside=True, skip=False, yes=True) == Choice("spike", "", hooks_aside=True, skip_prompts=True)


def test_the_hooks_question_is_asked_even_when_no_other_hooks_are_found_yet(tmp_path: Path, monkeypatch):
    menu = menu_answering(tmp_path, monkeypatch, ["", "2", "2", "1"])
    assert menu.choose("claude") == Choice("main", "", hooks_aside=True, skip_prompts=False)
    assert menu.choose("claude", yes=True).hooks_aside is True, "remembered"


def test_version_threes_hook_is_somebody_elses(tmp_path: Path):
    from supervisor.other_hooks import OtherHooks
    assert not OtherHooks.is_ours({"hooks": [{"type": "command", "command": "sh /p/.journal/src/hook.sh claude /p/.journal"}]})
    assert OtherHooks.is_ours({"hooks": [{"type": "command", "command": "sh /pkg/src/journal/hooks/hook.sh claude /p"}]})


def test_the_header_fits_the_width_and_moves_the_agents_clears_under_it():
    from supervisor.header import Header
    header = Header("agent-journal", "main")
    header.rows, header.columns = 10, 60
    text = header.line().decode()
    assert text.startswith("\x1b[H") and "agent-journal" in text and text.rstrip("\x1b[0m").endswith("journal starting…")
    header.url = "http://127.0.0.1:8420/"
    assert "http://127.0.0.1:8420/" in header.line().decode() and header.agent_rows == 9
    assert Header.shield(b"a\x1b[2Jb\x1b[Hc") == b"a\x1b[2;1H\x1b[Jb\x1b[2;1Hc"


def test_x_on_an_environment_deletes_it_after_a_confirmation_and_never_one_an_agent_works(tmp_path: Path, monkeypatch):
    deleted = []
    menu = menu_answering(tmp_path, monkeypatch, ["x1", "1", "x2", "2", "1", "2", "2", "2"])
    menu.journal = lambda *argv: deleted.append(argv) or ""
    assert menu.choose("claude").environment == "main"
    assert deleted == [("environment", "delete", "spike")]


def test_the_other_hooks_are_set_aside_and_put_back_with_later_edits_kept(tmp_path: Path):
    from supervisor.other_hooks import OtherHooks
    path = settings_with_other_hooks(tmp_path)
    hooks = OtherHooks(tmp_path, "claude")
    assert hooks.others() == [path]
    hooks.set_aside()
    left = json.loads(path.read_text())
    assert list(left["hooks"]) == ["PreToolUse"] and left["model"] == "opus"
    path.write_text(json.dumps({**left, "model": "sonnet"}))
    hooks.put_back()
    back = json.loads(path.read_text())
    assert set(back["hooks"]) == {"Stop", "PreToolUse"}
    assert back["model"] == "sonnet" and hooks.others() == [path]
    assert hooks.put_back() == [], "putting back twice does nothing"


def test_the_picker_moves_with_the_arrow_keys_and_jumps_by_number(tmp_path: Path):
    from supervisor.option import Option
    from supervisor.screen import Screen as Picker
    assert Picker._moved(0, "\x1b[B", 3) == 1 and Picker._moved(0, "\x1b[A", 3) == 2 and Picker._moved(0, "3", 3) == 2 and Picker._moved(1, "q", 3) == 1


def test_launch_parses_flags_and_builds_the_commands(tmp_path: Path):
    launch = Launch.parse(["claude", "--env", "spike", "--aside", "--", "--model", "x"], tmp_path)
    assert launch.env == "spike" and launch.aside and launch.args == ("--model", "x")
    assert launch.agent_command(Choice("spike", "s-1", True)) == ["claude", "--resume", "s-1", "--model", "x"]
    assert launch.agent_command(Choice("spike", "", True, skip_prompts=True)) == ["claude", "--dangerously-skip-permissions", "--model", "x"]
    environ = launch.environ(Choice("spike", "", True))
    assert environ["AGENT_JOURNAL_ACTIVE"] == "1" and environ["JOURNAL_ENV"] == "spike", "the journal's own hooks always run"
    assert environ["PATH"].startswith(str(tmp_path / ".journal" / "bin")), "the project's own journal command is on the agent's PATH, and nowhere else"
    assert launch.journal_command()[-1] == "serve"


def test_the_launch_puts_the_other_hooks_back_however_the_run_ends(tmp_path: Path):
    from supervisor.other_hooks import OtherHooks
    path = settings_with_other_hooks(tmp_path)

    class Dies:
        def run(self):
            assert len(json.loads(path.read_text())["hooks"]) == 1, "the other hooks are aside while the agent runs"
            raise RuntimeError("the agent fell over")

    class Launched(Launch):
        def choice(self):
            return Choice("main", "", hooks_aside=True)

        def supervisor(self, choice):
            return Dies()

    try:
        Launched.parse(["claude", "--env", "main", "--aside", "--yes"], tmp_path).run()
    except RuntimeError:
        pass
    assert set(json.loads(path.read_text())["hooks"]) == {"Stop", "PreToolUse"} and OtherHooks(tmp_path, "claude").put_back() == []


def test_the_supervisor_notices_the_journal_when_it_answers(tmp_path: Path, monkeypatch):
    from journal.app import App
    from journal.config import Config
    from supervisor.header import Header
    app = App(Config(tmp_path, port=0))
    app.server().start()
    try:
        header = Header("p", "main", stdout=os.open(os.devnull, os.O_WRONLY))
        supervisor = Supervisor(Terminal(["true"], str(tmp_path), {}), Inbox.for_(tmp_path, "main"), JournalProcess(tmp_path, ["true"], {}, tmp_path / "log"), header)
        supervisor._started_at = time.time()
        supervisor.notice_journal_once()
        assert header.url == f"http://127.0.0.1:{app.server().port}/"
    finally:
        app.server().stop()


def test_a_typed_line_can_wait_before_it_goes_in(tmp_path: Path):
    out_r, out_w = os.pipe()
    in_r, in_w = os.pipe()
    terminal = Terminal(["sh", "-c", "while read line; do echo \"got:$line\"; done"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox.for_(tmp_path, "main")
    journal = JournalProcess(tmp_path, ["sh", "-c", "sleep 30"], {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    supervisor = Supervisor(terminal, inbox, journal, stdin=in_r, stdout=out_w)
    inbox.open()
    journal.start()
    terminal.start()
    try:
        with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as link:
            link.sendto(json.dumps({"type": "Type", "line": "now"}).encode(), str(inbox.path))
            link.sendto(json.dumps({"type": "Type", "line": "later", "after": 0.8}).encode(), str(inbox.path))
        pump(supervisor, 0.5)
        seen = os.read(out_r, 65536).decode()
        assert "got:now" in seen and "later" not in seen, "the line with a delay has not gone in yet; lines go in the order they were sent"
        pump(supervisor, 1.0)
        assert "got:later" in os.read(out_r, 65536).decode()
    finally:
        supervisor.stop()
        journal.stop()
        inbox.close()


def test_a_stop_instruction_ends_the_supervisor_and_takes_its_inbox_down(tmp_path: Path):
    out_r, out_w = os.pipe()
    terminal = Terminal(["sh", "-c", "trap '' TERM; while true; do sleep 1; done"], str(tmp_path), {"PATH": os.environ["PATH"]})
    inbox = Inbox.for_(tmp_path, "main")
    journal = JournalProcess(tmp_path, ["sh", "-c", "sleep 30"], {"PATH": os.environ["PATH"]}, tmp_path / "server.log")
    supervisor = Supervisor(terminal, inbox, journal, stdin=None, stdout=out_w)
    inbox.open()
    journal.start()
    terminal.start()
    try:
        assert inbox.announced_at.read_text() == str(inbox.path)
        with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as link:
            link.sendto(json.dumps({"type": "Stop"}).encode(), str(inbox.path))
        began = time.time()
        while supervisor._code is None and time.time() - began < 8:
            supervisor.relay_once(0.05)
        assert supervisor._code is not None, "an agent that ignores TERM is still ended"
        assert terminal.exited() is None, "reaped once, never asked after again"
    finally:
        journal.stop()
        inbox.close()
    assert not inbox.announced_at.exists()
