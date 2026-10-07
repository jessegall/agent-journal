import os
import time
from pathlib import Path

import features
from controllers.types import Agents, Environments, Messages
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh


def test_a_message_wakes_the_environments_last_conversation_when_no_agent_runs(monkeypatch):
    features.load()
    started = []
    monkeypatch.setattr("features.starting_agents.launch.detached",
                        lambda root, cwd, env, agent, args, conversation="": started.append((env, agent, conversation)) or 1)
    record = fresh()
    Environments(record, actor=SYSTEM).create(record.env)
    Agents(record, actor=SYSTEM).create("4d863ccb-old", event="SessionEnd", provider="claude", at=100.0)
    Agents(record, actor=SYSTEM).create("bea86f27-last", event="SessionEnd", provider="codex", at=200.0)
    Agents(record, actor=SYSTEM).create("claude-20640", provider="claude", at=300.0)
    Messages(record, actor=USER).create("are you there?")
    assert started == [], "with the setting off, a message starts nothing"
    record.set_setting("starting_agents", {"wake_on_message": True})
    Messages(record, actor=AGENT).create("I am writing to myself")
    assert started == [], "the agent's own message wakes nothing"
    Messages(record, actor=USER).create("are you there now?")
    assert started == [(record.env, "codex", "bea86f27-last")], "the user's message resumes the environment's last conversation on its provider"
    Messages(record, actor=USER).create("hello again")
    assert len(started) == 1, "a second message while that start is under way starts nothing more"
    import os
    from engine.sessions import Sessions
    environments = Environments(record, actor=SYSTEM)
    environments.update(environments.rows.by_title(record.env).n, launched=0)
    Sessions(record.root).write("claude-held", environment=record.env, pid=os.getpid())
    Messages(record, actor=USER).create("are you still there?")
    assert len(started) == 1, "a message while an agent holds the environment wakes nothing"
    quiet = fresh("quiet")
    quiet.set_setting("starting_agents", {"wake_on_message": True})
    Environments(quiet, actor=SYSTEM).create(quiet.env)
    Messages(quiet, actor=USER).create("anyone?")
    assert len(started) == 1, "an environment with no conversation to carry on starts nothing"


def test_the_agents_command_is_found_where_it_installs_itself_or_refused_in_words(tmp_path, monkeypatch):
    from providers import DRIVERS
    from tests.conftest import refused
    claude = DRIVERS["claude"]
    home = tmp_path / "local"
    home.mkdir()
    monkeypatch.setattr(claude, "HOMES", (str(home),))
    assert "install Claude Code, or put claude on your PATH" in refused(lambda: claude.binary(str(tmp_path / "empty"))), \
        "with no claude anywhere, the start is refused in words instead of a traceback"
    found = home / "claude"
    found.write_text("#!/bin/sh\n")
    found.chmod(0o755)
    assert claude.binary(str(tmp_path / "empty")) == str(found), "a claude off the PATH, where Claude Code installs itself, is found"


def test_an_agent_that_is_not_installed_is_refused_before_anything_is_changed(tmp_path, monkeypatch):
    import json
    from commands.launch import launch
    from features.clean_slate.slate import moved
    from tests.conftest import refused
    record = fresh()
    project = record.root.parent
    (project / ".codex").mkdir()
    hooks = project / ".codex" / "hooks.json"
    hooks.write_text(json.dumps({"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "keep-going.sh"}]}]}}))
    before = hooks.read_text()
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    monkeypatch.setenv("PATH", str(tmp_path / "empty"))
    monkeypatch.chdir(project)
    viewers = []
    monkeypatch.setattr("engine.viewer.start", lambda root, cwd: viewers.append(root) or "")
    for given in (["--no-interaction"], None):
        assert "install" in refused(lambda: launch(record, "codex", given)), "the missing agent is refused in words"
    assert viewers == [] and moved(record) == [] and hooks.read_text() == before, "no viewer started and no hook set aside"
    place = Environments(record, actor=USER).create("worktree-one")
    assert "only the user starts an agent" in refused(lambda: Environments(record, actor=AGENT).action("launch")(place.n)), "an agent never starts another agent in an environment"
    assert "no agent called 'gemini'" in refused(lambda: Environments(record, actor=USER).action("launch")(place.n, agent="gemini")), \
        "an agent that is not one of the journal's is refused with the ones it has"


def test_the_start_offers_to_carry_on_the_environments_last_session():
    from tests.kit import asked_resume
    from engine.sessions import Sessions
    record = fresh()
    assert asked_resume(record, "codex", [], ask=lambda _: "1", answering=True) == [], "nothing to carry on, nothing asked"
    Sessions(record.root).bind("old-thread", record.env, pid=999999, provider="codex")
    Sessions(record.root).bind("5e3c0a1f-conversation", record.env, pid=999999, provider="claude")
    assert asked_resume(record, "codex", [], ask=lambda _: "1", answering=True) == ["resume", "old-thread"], "yes resumes that environment's own session"
    assert asked_resume(record, "claude", ["--model", "opus"], ask=lambda _: "2", answering=True) == ["--model", "opus"], "no starts a new one"
    assert asked_resume(record, "claude", ["-c"], ask=lambda _: "1", answering=True) == ["-c"], "a typed continue is the answer already"
    from tests.kit import defaults
    assert asked_resume(record, "codex", [], ask=defaults, answering=True) == ["resume", "old-thread"], "--no-interaction takes the default without asking"
    Sessions(record.root).bind("claude-4242", record.env, pid=999999, provider="claude")
    assert asked_resume(record, "claude", [], ask=lambda _: "1", answering=True) == ["--resume", "5e3c0a1f-conversation"], "a supervisor's name is no conversation"
    from tests.kit import answer
    answer(PROVIDERS["claude"](), record.root, {"hook_event_name": "UserPromptSubmit", "session_id": "5e3c0a1f-conversation", "cwd": str(record.root.parent)}, os.getpid())
    assert asked_resume(record, "claude", [], ask=lambda _: "1", answering=True) == [], "a conversation restarted under a new process is still running"
    Sessions(record.root).bind("7a1d-in-the-worktree", "0922-disposal-date", pid=999999, provider="claude")
    assert asked_resume(record, "claude", ["--worktree", "0922-disposal-date"], ask=lambda _: "1", answering=True) == [
        "--worktree", "0922-disposal-date", "--resume", "7a1d-in-the-worktree"], "a named worktree carries on its own last conversation"


def test_the_command_line_answers_what_is_wired_what_is_set_and_what_a_command_does(capsys, tmp_path, monkeypatch):
    from commands.cli import run
    features.load()
    record = fresh()
    read = lambda *words: (run(["--root", str(record.root), "--env", record.env, *words]), (lambda seen: seen.out + seen.err)(capsys.readouterr()))[1]
    checked = read("verify")
    assert "in force" in checked and "claude: hooks NOT wired" in checked and "engine: 0 running" in checked, "verify names the root, the hooks that are not wired and the engines running"
    assert "the journal is off" in read("disable") and "off" in read("verify").splitlines()[2], "disable puts the journal off and verify says so"
    assert "in force" in read("enable"), "enable puts it back in force"
    assert "settings on t" in read("settings") and "features.work_tracking" in read("settings"), "settings lists the environment's features"
    assert "no command 'juggle'" in read("help", "juggle") and "usage" in read("help", "todo").lower(), "help says what one command does and names one that is missing"
    assert "sharing.server" in read("services"), "the services list names the services features and plugins run"
    assert "sharing.server is asked to run" in read("services", "start", "sharing.server") and "sharing.server is asked to stop" in read("services", "stop", "sharing.server"), \
        "a service is asked to run or to stop by name"
    assert "nothing is logged" in read("services", "log", "sharing.server"), "a service that never ran has no log"
    assert "which service" in read("services", "restart") and "knows list" in read("services", "juggle"), "a restart without a name and an unknown action are refused with the way to ask"
    record = fresh()
    read = lambda *words: (run(["--root", str(record.root), "--env", record.env, *words]), (lambda seen: seen.out + seen.err)(capsys.readouterr()))[1]
    record.set_setting("delivery", {"mode": "one"})
    assert "delivery: {'mode': 'one'}" in read("settings"), "a setting that is not a feature is listed with its value"
    agents = Agents(record, actor=SYSTEM)
    agents.create("claude-1", provider="claude", transcript=str(tmp_path / "gone.jsonl"))
    agents.create("claude-2", provider="nobody", transcript=str(tmp_path))
    assert read("search", "anything") == "\n", "a transcript that is gone or of no known provider finds nothing"
    assert read("conversation").strip() == "", "with no session named there is no conversation to read back"
    calls = []
    monkeypatch.setattr("commands.queries.launch", lambda rec, agent, args: calls.append((agent, args)) or "started")
    assert "started" in read("claude", "--model", "x") and calls[0][0] == "claude", "starting an agent hands the rest of the line to it"
    monkeypatch.setattr("engine.heal.heal", lambda root: "went back to the last build that started")
    assert "went back" in read("heal"), "heal says which build it went back to"
    ticks = []
    class Manager:
        def __init__(self, root, alive, sources): ticks.append("made")
        def tick(self): ticks.append("tick")
    monkeypatch.setattr("engine.services.Manager", Manager)
    def sleep(seconds):
        raise KeyboardInterrupt
    monkeypatch.setattr("commands.queries.time.sleep", sleep)
    assert "the services are stopped" in read("services", "up"), "Ctrl-C stops the services kept up in the terminal"
    assert ticks == ["made", "tick"], "the services are looked after once a second until then"
    ran = []
    monkeypatch.setattr("serve.run", lambda root, port: ran.append(port))
    read("serve", "--port", "8123")
    assert ran == [8123], "the viewer is served on the port asked for"


def test_a_running_agents_screen_is_read_from_where_the_viewer_stopped_and_a_live_session_is_moved_to_another_environment():
    import base64
    import json
    from commands.http import dispatch
    from engine import runtime
    from engine.seats import SEAT
    from engine.sessions import Sessions
    from engine.stored import write_json
    from tests.kit import report
    features.load()
    record = fresh()
    Environments(record, actor=SYSTEM).create("elsewhere")
    folder = runtime.session_file(record.root, "term-1", "screen").parent
    folder.mkdir(parents=True)
    seat = lambda at: write_json(folder / SEAT, {"at": at, "agent": "claude", "env": record.env, "report": {"title": "claude-5"}, "reported": {"title": "claude-5", "provider": "claude", "status": "idle"}})
    assert dispatch("GET", f"/api/{record.env}/agent/term-1/screen", record.root, {}, {}).code == 404, "an agent that shows no terminal has no screen to read"
    seat(time.time())
    blank = dispatch("GET", f"/api/{record.env}/agent/term-1/screen", record.root, {}, {}).body
    assert (blank["data"], blank["at"], (blank["rows"], blank["cols"])) == ("", 0, (40, 120)), "a terminal that printed nothing is a blank screen of the usual size"
    (folder / "screen").write_bytes(b"hello world")
    (folder / "screen.json").write_text(json.dumps({"rows": 24, "cols": 80}))
    part = lambda since: dispatch("GET", f"/api/{record.env}/agent/term-1/screen", record.root, {"since": str(since)}, {}).body
    first, later, past = part(0), part(5), part(-1)
    assert (base64.b64decode(first["data"]), first["at"], first["rows"], first["cols"]) == (b"hello world", 11, 24, 80), "the whole screen is read from the start"
    assert (base64.b64decode(later["data"]), later["at"]) == (b" world", 11), "a poll reads only what was printed after the point it stopped at"
    assert base64.b64decode(past["data"]) == b"hello world" and base64.b64decode(part(99)["data"]) == b"hello world", \
        "a point that is behind the start or beyond the end reads the screen again"

    Sessions(record.root).bind("claude-5", record.env, provider="claude")
    report(record, "idle", "Stop", session="claude-5")
    moved = dispatch("POST", f"/api/elsewhere/appoint", record.root, {}, {"session": "claude-5"})
    assert (moved.code, moved.body["before"], moved.body["environment"]) == (200, record.env, "elsewhere"), "a live session is appointed to another environment and says where it came from"
    assert Sessions(record.root).environment("claude-5") == "elsewhere", "the session now belongs to the environment it was moved to"
    assert dispatch("POST", f"/api/nowhere/appoint", record.root, {}, {"session": "claude-5"}).code == 400, "an environment that does not exist is refused"
    assert dispatch("POST", f"/api/elsewhere/appoint", record.root, {}, {"session": "claude-404"}).code == 400, "a session that is not online is refused"


def test_starting_an_agent_asks_which_environment_and_takes_over_a_busy_one_only_when_told_to(capsys, monkeypatch):
    import commands.launch as launch
    from commands.launch import asked_for, banner, choose, defaults
    from features.agent_sessions.launch import prepared
    from features.helpers.controller import Helpers
    from engine.sessions import Sessions
    features.load()
    record = fresh()
    Environments(record, actor=SYSTEM).create(record.env)
    Environments(record, actor=SYSTEM).create("second")
    def script(*answers):
        remaining = iter(answers)
        def answer(prompt=""):
            try:
                return next(remaining)
            except StopIteration as over:
                raise EOFError from over
        return answer
    assert asked_for(record, worktree="calm-river") == record.env, "an agent started in a worktree keeps the environment it was given"
    assert asked_for(record, ask=script(), answering=False) == record.env, "with nobody to ask, the first environment is used"
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    assert asked_for(record, answering=False) == "second", "with nobody to ask, a busy environment is passed over for a free one"
    assert asked_for(record, ask=defaults, answering=True) == "second", "answering with Enter picks the free environment"
    assert asked_for(record, ask=script("2"), answering=True) == "second", "a number picks that environment"
    printed = capsys.readouterr().out
    assert "[agent working]" in printed and "Which environment" in printed, "the question names the environment that already has an agent working"
    assert asked_for(record, ask=script("1", "2", "2"), answering=True) == "second", "not taking a busy environment over asks again"
    assert Sessions(record.root).holder(record.env) == "claude-1", "an agent is not moved off unless the user says so"
    assert asked_for(record, ask=script("1", "1"), answering=True) == record.env and Sessions(record.root).holder(record.env) == "", \
        "taking a busy environment over moves the agent that held it"
    assert asked_for(record, ask=script("3", "brand new"), answering=True) == "brand new", "a new environment is made under the name typed"
    assert asked_for(record, ask=script("4", "second", "4", "named after refusal"), answering=True) == "named after refusal", "a name that is refused returns to the question"
    assert asked_for(record, ask=script("5"), answering=True) == record.env, "a closed input while naming keeps the environment it started in"
    capsys.readouterr()
    assert asked_for(record, ask=script("x", ""), answering=True) == record.env, "a wrong answer is asked again, and Enter takes the first free environment"
    assert "A number from 1 to 5" in capsys.readouterr().out, "a wrong number is told how to answer"
    assert choose("Pick", [], ["a", "b"], 0, ask=lambda prompt: (_ for _ in ()).throw(EOFError)) is None, "a closed input answers nothing"
    assert "agent-journal" in banner("claude", record.root.parent) and "claude".capitalize() in banner("claude", record.root.parent), "the banner names the agent about to start"
    helper = Helpers(record, actor=SYSTEM).create("a long job", name="Hedy", provider="claude", model="sonnet", environment="helper-hedy")
    prepared(record, "helper-hedy", "Where helper Hedy works", helper.ref, Path(record.root).parent)
    Sessions(record.root).bind("claude-2", "helper-hedy", pid=os.getpid(), provider="claude")
    offered = []
    monkeypatch.setattr(launch, "choose", lambda *given: offered.append(given[2]) or choose(*given))
    asked_for(record, ask=script(""), answering=True)
    badges = {choice.label: choice.badges for choice in offered[0] if hasattr(choice, "badges")}
    assert badges["helper-hedy"] == ("helper Hedy",), "a helper's environment is listed as the helper's, never as an agent working"


def test_a_supervisor_is_started_in_the_foreground_or_detached_with_the_launch_it_was_asked_for(monkeypatch, capsys):
    import json
    import agents.terminal as terminal
    features.load()
    record = fresh()
    read, write = terminal.lifeline()
    assert (os.get_inheritable(read), os.get_inheritable(write)) == (True, False), "the lifeline's read end goes on to the agent and its write end stays here"
    os.close(read)
    os.close(write)
    assert terminal.carried() is None, "an agent started fresh carries nothing over"
    monkeypatch.setenv(terminal.CARRIED, json.dumps({"pid": 9}))
    assert (terminal.carried(), terminal.CARRIED in os.environ) == ({"pid": 9}, False), "what an older build carried over is read once and then forgotten"
    spec = terminal.launch_spec(record.root, record.root.parent, "t", "claude", ["--model", "x"], taken={"pid": 5, "fd": 7, "session": "claude-5", "saved": "s"})
    assert (spec["adopt"], spec["args"], spec["env"]) == ({"pid": 5, "fd": 7, "session": "claude-5", "saved": "s"}, ["--model", "x"], "t"), \
        "a session that is taken over from an older build is adopted with its terminal and arguments"
    executed = []
    monkeypatch.setattr(terminal.os, "execv", lambda program, argv: executed.append((program, argv)))
    monkeypatch.setattr(terminal, "hold_build", lambda *given: None)
    held, spare = os.pipe()
    terminal.supervise(record.root, record.root.parent, "t", "claude", [], taken={"pid": 5, "fd": held, "session": "claude-5", "saved": "s"})
    (program, argv), = executed
    assert (json.loads(argv[-1])["adopt"]["pid"], os.get_inheritable(held)) == (5, True), "the supervisor is handed the launch as its last argument, with the terminal it adopts"
    os.close(held)
    os.close(spare)
    popped = []
    class Child:
        pid = 4242
    monkeypatch.setattr(terminal.subprocess, "Popen", lambda command, **options: popped.append((command, options)) or Child())
    assert terminal.detached(record.root, record.root.parent, "t", "claude", ["--model", "x"]) == 4242, "a detached agent answers with its supervisor's process"
    (command, options), = popped
    assert (json.loads(command[-1])["headless"], options["start_new_session"], terminal.launch_log(record.root, "t").parent.is_dir()) == (True, True, True), \
        "it runs headless in a session of its own and logs to a file of its own"
    monkeypatch.undo()
    import pty
    import select
    import threading
    import commands.launch as launching
    handed = []
    monkeypatch.setattr(terminal, "supervise", lambda root, project, env, agent, args, taken=None: handed.append((env, args, taken)))
    monkeypatch.setattr("engine.viewer.start", lambda root, project: "")
    monkeypatch.setattr(launching.DRIVERS["claude"], "binary", classmethod(lambda cls, path: "claude"))
    monkeypatch.setattr("commands.launch_update.latest_first", lambda record: "an update waits")
    monkeypatch.chdir(record.root.parent)
    assert launching.launch(record, "claude", [launching.NO_INTERACTION, "--model", "x"]) == "", "a start that asks nothing hands the agent to the supervisor"
    out = capsys.readouterr().out
    assert (handed[-1][:2], "carrying on with" in out, "the viewer did not start" in out) == ((record.env, ["--model", "x"]), True, True), \
        "it says which update waits, and when the viewer did not come up"
    from controllers.types import Environments
    from engine.sessions import Sessions
    if not Environments(record, actor="system").rows.by_title(record.env):
        Environments(record, actor="system").create(record.env)
    Sessions(record.root).write("someone-else", environment=record.env, provider="claude", pid=os.getpid())
    assert launching.launch(record, "claude", [launching.NO_INTERACTION]) == "" and handed[-1][0] == record.env, \
        "a start that asks nothing never waits for a name, even when another agent holds every environment"
    Sessions(record.root).unbind("someone-else")
    monkeypatch.setenv(terminal.CARRIED, json.dumps({"env": "t", "args": ["--resume"], "pid": 7}))
    launching.launch(record, "claude", None)
    assert handed[-1] == ("t", ["--resume"], {"env": "t", "args": ["--resume"], "pid": 7}), "an agent an older build carried over is handed on as it was, with nothing asked"
    master, slave = pty.openpty()
    answering = threading.Event()

    def press_enter():
        until = time.time() + 20
        while not answering.is_set() and time.time() < until:
            if not select.select([master], [], [], 0.1)[0]:
                continue
            try:
                wrote = os.read(master, 4096)
            except OSError:
                return
            if b"to leave" in wrote:
                os.write(master, b"\r")
        os.close(master)

    typist = threading.Thread(target=press_enter, daemon=True)
    typist.start()
    terminal_in, terminal_out = os.fdopen(slave, "r"), os.fdopen(os.dup(slave), "w")
    monkeypatch.setattr("sys.stdin", terminal_in)
    monkeypatch.setattr("sys.stdout", terminal_out)
    monkeypatch.setattr(launching, "banner", lambda agent, project: "a banner")
    try:
        launching.launch(record, "claude", [])
    finally:
        answering.set()
        typist.join(timeout=5)
        monkeypatch.undo()
    assert handed[-1][0] == record.env, "a start in a real terminal asks its questions there and takes the default on Enter"
    from commands.menu import pick

    def picked(*keys):
        master, slave = pty.openpty()
        monkeypatch.setattr("sys.stdin", os.fdopen(slave, "r"))
        monkeypatch.setattr("sys.stdout", os.fdopen(os.dup(slave), "w"))

        def type_keys():
            for group in keys:
                time.sleep(0.3)
                for key in group:
                    try:
                        os.write(master, key)
                    except OSError:
                        return
                    time.sleep(0.005)

        def drain():
            while select.select([master], [], [], 0.1)[0] or not done.is_set():
                try:
                    os.read(master, 4096)
                except OSError:
                    return

        done = threading.Event()
        threading.Thread(target=type_keys, daemon=True).start()
        threading.Thread(target=drain, daemon=True).start()
        try:
            return pick("Which one", ["a note"], ["first", "second", "third"], 0)
        except BaseException as stopped:
            return type(stopped).__name__
        finally:
            done.set()
            monkeypatch.undo()

    assert [picked((b"j",), (b"\r",)), picked((b"k",), (b"\r",)), picked((b"3",), (b"\r",)), picked((b"\x1b", b"[", b"B"), (b"\r",))] == [1, 2, 2, 1], \
        "the start menu moves with the keys typed in a real terminal, wrapping at the ends, and takes a number or an arrow sent in pieces"
    assert picked((b"\x1b",)) == "SystemExit", "Escape leaves the menu without choosing"
    from commands.menu import read_keys
    try:
        read_keys(2 ** 20)
        raise AssertionError("a terminal that cannot be read ends the menu")
    except SystemExit as ended:
        assert "input ended" in str(ended), "a terminal that cannot be read says its input ended"


def test_stopping_the_journal_names_what_was_left_open_and_the_other_commands_answer_for_a_session_that_ended(monkeypatch, capsys):
    import engine.stop as stop
    from commands.cli import run
    from controllers.types import Works
    features.load()
    record = fresh()
    read = lambda *words: (run(["--root", str(record.root), "--env", record.env, *words]), (lambda seen: seen.out + seen.err)(capsys.readouterr()))[1]
    Works(record, actor=AGENT).create("an unfinished job")
    monkeypatch.setattr(stop, "ended", lambda root: True)
    stopped = read("stop")
    assert "the journal is stopped" in stopped and "work 1 is still open: an unfinished job" in stopped, "stopping says what was left open, with the commands that close it"
    monkeypatch.setattr(stop, "ended", lambda root: False)
    assert "the server did not stop" in read("stop"), "a server that stays up is said so, with where to look"
    assert "no session ghost to attach to" in read("attach", "ghost"), "attaching to a session that is not there says so"
    assert "no agent session is running" in read("nothing", "no checkpoint matters"), "a note with no agent session to put it on is refused"
    monkeypatch.setattr("engine.stop.ask", lambda root: None)
    monkeypatch.setattr("engine.typist.live", lambda root: [])
    monkeypatch.setattr("commands.queries.kept_work", lambda cwd: None)
    assert read("ended").strip() == "", "a session that ends puts back what it set aside and stops the journal when no session is left"
    monkeypatch.setattr("install.upgrade", lambda project, root, yes=False: [f"upgraded {project.name} {yes}"])
    assert "upgraded" in read("upgrade", "--yes") and "True" in read("upgrade", "--yes"), "an upgrade prints what it did"
    monkeypatch.setattr("commands.demo.demo_built", lambda folder, into, environment, name: f"built {into.name}")
    assert "built shop" in read("demo", "recording", "shop"), "a demo is built into the folder asked for"


def test_the_command_line_runs_a_forced_command_prints_rows_and_refuses_what_the_server_does_not_run(capsys, monkeypatch):
    import features
    from commands.cli import captured, first_word, noun_of, run
    from tests.conftest import fresh
    features.load()
    record = fresh()
    base = ["--root", str(record.root), "--env", record.env]
    read = lambda *words: (run([*base, *words]), (lambda seen: seen.out + seen.err)(capsys.readouterr()))
    code, text = read("--force")
    assert code == 1 and "--force takes the reason" in text, "forcing past a hold needs a reason"
    code, text = read("todo", "all", "--force", "because the user said so")
    assert code == 0, "a forced command with its reason runs"
    code, text = read()
    assert code == 0 and "usage" in text.lower(), "no command shows the help"
    code, text = read("todo", "frobnicate")
    assert code != 0, "a word the noun lacks is refused"
    assert (first_word(["--env", "x", "todo"]), first_word(["-h"]), noun_of(["--agent", "a", "todo", "all"]), noun_of(["banana"])) == ("todo", "", "todo", "-"), \
        "the first word skips the options that take a value"
    code, text = read("--plugin", "demo", "todo", "create", "a first row")
    assert code == 0, "a row made by a plugin is created: " + text
    code, text = read("todo", "all")
    assert "a first row" in text, "a list prints one row to a line"
    code, text = read("todo", "show", "1")
    assert code == 0 and "a first row" in text, "a row prints in full"
    out, code = captured(["banana"], record.root)
    assert (code, "is not a command the server runs" in out) == (None, True), "the server runs only the nouns it knows"
    out, code = captured(["todo", "show", "99"], record.root)
    assert code == 1 and out.startswith("!"), "a refusal comes back with its code"
    out, code = captured(["todo", "show"], record.root)
    assert code == 2 and "usage" in out.lower(), "a command missing its words comes back with the usage and the code of a misuse"
    code, text = read("todo", "all", "--no-such-option")
    assert code == 2 and "unrecognized arguments" in text, "an option the command does not know is refused"
    import commands.cli as cli
    monkeypatch.setattr(cli, "run", lambda argv, out=None, err=None: 1 / 0)
    assert captured(["todo", "all"], record.root) == ("! ZeroDivisionError: division by zero", 1), "a command that crashes is answered in one line, not a trace"
    monkeypatch.setattr(cli, "run", lambda argv, out=None, err=None: 3)
    assert captured(["todo", "all"], record.root) == ("! todo all was refused and printed nothing", 3), "a refusal that said nothing is named"
