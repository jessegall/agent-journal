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


def test_without_other_hooks_the_hooks_question_is_not_asked(tmp_path: Path, monkeypatch):
    menu = menu_answering(tmp_path, monkeypatch, ["", "2", "2"])
    assert menu.choose("claude") == Choice("main", "", hooks_aside=False, skip_prompts=False)
    assert menu.choose("claude", aside=True, yes=True).hooks_aside is False, "nothing to set aside"


def test_the_manage_screen_deletes_an_environment_that_no_agent_works(tmp_path: Path, monkeypatch):
    deleted = []
    menu = menu_answering(tmp_path, monkeypatch, ["4", "2", "2", "1", "1", "3", "1", "2", "2"])
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
    assert Picker._moved(0, "\x1b[B", 3) == 1 and Picker._moved(0, "\x1b[A", 3) == 2 and Picker._moved(0, "3", 3) == 2 and Picker._moved(1, "x", 3) == 1


def test_launch_parses_flags_and_builds_the_commands(tmp_path: Path):
    launch = Launch.parse(["claude", "--env", "spike", "--aside", "--", "--model", "x"], tmp_path)
    assert launch.env == "spike" and launch.aside and launch.args == ("--model", "x")
    assert launch.agent_command(Choice("spike", "s-1", True)) == ["claude", "--resume", "s-1", "--model", "x"]
    assert launch.agent_command(Choice("spike", "", True, skip_prompts=True)) == ["claude", "--dangerously-skip-permissions", "--model", "x"]
    environ = launch.environ(Choice("spike", "", True))
    assert environ["AGENT_JOURNAL_ACTIVE"] == "1" and environ["JOURNAL_ENV"] == "spike", "the journal's own hooks always run"
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
