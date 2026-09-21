import json
import os
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from controllers.types import Agents, Messages, Nudges, Facts, Questions, Todos, Works
from engine import bus
from engine import engine as engine_module
from engine.actors import Agent, BUSY, IDLE, STOPPED, WORKING, User
from engine.band import ROWS, release
from engine.drivers import Claude, Codex, Driver
from engine.engine import Engine, TYPING_HOLD
from engine.record import Record
from engine.sessions import ACTIVE_ENV, Sessions
from engine.terminal import agent_environment
from features.start.feature import WAIT_FOR_REPORT, hello
from resources.base import AGENT, SYSTEM, USER
from resources.types import PRIORITY, AgentRow


class Fake(Driver):
    name = "fake"

    def __init__(self, record):
        super().__init__(record, "fake-1", fd=1)
        self.sent = []
        self.lands = True
        self.report = None
        self.quiet = 10.0
        self.up = True

    def command(self, args):
        return ["true"]

    def alive(self):
        return self.up

    def send(self, text):
        self.sent.append(text)
        return self.lands

    def last_report(self):
        return AgentRow(title=self.report.pop("session", ""), data=self.report) if self.report else None

    def quiet_for(self):
        return self.quiet

    def last_printed(self):
        return "❯ "


def settle(engine, driver):
    engine.tick()
    engine.agent.pending_at -= 5
    engine.tick()
    engine.typed_at = 0
    driver.sent.clear()
    return engine.tick()


def test_engine_state_delivery_nudges_probing_and_session_following():
    root = Path(tempfile.mkdtemp()) / ".journal"
    record = Record(root, "main")
    driver = Fake(record)
    engine = Engine(record, driver)
    engine.start()
    assert (engine.running, (engine.stop(), engine.running)[1]) == (True, False), \
        "start puts the engine in its loop; stop takes it out"
    assert agent_environment({"PATH": "/bin"}) == {"PATH": "/bin", ACTIVE_ENV: "1"}, \
        "the launcher marks only the child agent environment as journal-managed"

    driver.up = False
    assert engine.agent.state() == STOPPED, "no driver alive: stopped"
    driver.up = True
    driver.report = None
    driver.quiet = 0.2
    assert engine.agent.state() == BUSY, "no reports yet, printing without declared work: busy"
    driver.quiet = 4.0
    assert engine.agent.state() == IDLE, "no reports yet, quiet: idle"
    driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
    driver.quiet = 6.0
    assert engine.agent.state() == BUSY, "a tool call under way without declared work: busy"
    driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
    driver.quiet = 2.0
    assert (engine.agent.state(), engine.agent.is_idle()) == (IDLE, True), "a Stop and quiet: idle"
    driver.report = {"at": time.time(), "event": "SessionStart", "status": IDLE}
    assert engine.agent.is_idle() is True, "a SessionStart is idle too"
    driver.report = {"at": time.time(), "event": "PostToolUse", "status": WORKING}
    assert engine.agent.state() == BUSY, "between tool calls without declared work: busy"

    driver.report = None
    Messages(record, actor=USER).create("look at the header")
    assert (engine.tick(), driver.sent) == ("waiting for the agent's first report", []), \
        "nothing is delivered before the agent's first report: it may be at a dialog"
    driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
    driver.quiet = 0.1
    assert driver.sent == [], "before a tick nothing is typed"
    why = engine.tick()
    assert (why, driver.sent) == ("typed 1 in one line", ["1 new message"]), \
        "the user's own message does not wait for the batch: it is typed at once"
    assert User(record).unread() == [], "the user is not notified of their own event"
    assert (engine.tick(), len(driver.sent)) == (BUSY, 1), "the cursor moved: a further tick types nothing more"
    assert bool(Messages(record, actor=SYSTEM).load(1).data.get("delivered")) is True, \
        "the line landed, so the message it named says when the agent was told"
    assert [e.action for e in record.events() if e.type == "message"] == ["created"], \
        "and the stamp is quiet: no event was written about it"
    driver.sent.clear()
    Messages(record, actor=AGENT).complete(1, "read and filed")
    engine.tick()
    assert ([n.refs for n in User(record).unread()], driver.sent) == ([], []), \
        "the agent's own act is not told to the user or back to the agent: it is read in the activity"

    driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
    driver.quiet = 3.0
    Todos(record, actor=USER).create("a chore")
    Questions(record, actor=USER).create("which colour")
    settle(engine, driver)
    assert (driver.sent[-1] == "1 unread question") is True, \
        "idle with unread resources: the highest priority type first, with its numbers"
    Questions(record, actor=AGENT).read(1)
    settle(engine, driver)
    assert (driver.sent[-1] == "1 unread todo") is True, "the question seen: the to-do is next in priority"
    Todos(record, actor=AGENT).read(1)
    why = settle(engine, driver)
    assert (why, driver.sent) == ("nothing owed", []), "everything seen: nothing owed"
    Works(record, actor=AGENT).create("the header")
    driver.report = {"at": time.time(), "event": "PostToolUse", "status": WORKING}
    assert engine.agent.state() == WORKING, "active with declared work: working"
    driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
    driver.quiet = 3.0
    why = settle(engine, driver)
    assert (why, driver.sent) == ("nothing owed", []), \
        "the agent's own work is not owed to it by the engine: that is the work feature's nudge"
    Nudges(record, actor=SYSTEM).create("work 1 open")
    driver.sent.clear()
    engine.tick()
    engine.agent.pending_at -= 5
    driver.report = {"at": time.time() - 100, "event": "Stop", "status": IDLE}
    engine.tick()
    engine.tick()
    assert (engine.why, driver.sent) == ("typed, waiting for the hooks", ["work 1 open"]), \
        "a line typed a moment ago is not followed by a nudge before the hooks report"
    assert PRIORITY[0] == "message", "the priority order is messages first"

    seat = json.loads((root / "runtime" / "seat-fake-1.json").read_text())
    assert (seat["agent"], seat["state"], seat["why"]) == ("fake", IDLE, "typed, waiting for the hooks"), \
        "the seat record says the agent, its state and the last decision"

    heard = []
    bus.on("*", lambda e, r: heard.append((e.type, e.action)))
    Facts(record, actor=USER).create("a fact")
    assert heard[-1] == ("fact", "created"), "record.emit reaches the bus"
    bus.clear()

    driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
    engine.tick()
    engine.agent.pending_at -= 5
    engine.tick()
    driver.sent.clear()
    Agents(record, actor=SYSTEM).by_session("fake-1")
    Nudges(record, actor=SYSTEM).create("2 reminders standing, read them", brief="1. run the suites")
    before = len(User(record).unread())
    engine.tick()
    engine.agent.pending_at -= 5
    engine.tick()
    assert driver.sent == ["2 reminders standing, read them — 1. run the suites"], \
        "a nudge is typed as its title and brief, not as type n action"
    assert len(User(record).unread()) == before, "the user is not notified of a nudge"
    assert ("agent" in [e.type for e in record.events()], len(driver.sent)) == (True, 1), \
        "an agent row's events reach nobody: only the nudge was typed"

    assert (engine_module.web_remote("git@github.com:me/repo.git"), engine_module.web_remote("https://example.com/me/repo.git")) == \
        ("https://github.com/me/repo", ""), \
        "a github ssh remote becomes the branch's web home; an unknown host is not guessed at"
    driver.sent.clear()
    driver.interrupted = 0
    driver.interrupt = lambda: setattr(driver, "interrupted", driver.interrupted + 1)
    driver.report = {"at": time.time() - 200, "event": "PreToolUse", "status": WORKING}
    driver.quiet = 200.0
    driver.tail = "still printing"
    driver.at_prompt = lambda: "›" in driver.tail
    engine.typed_at = 0
    assert (engine.tick(), driver.interrupted) == ("silent for two minutes: probing with Ctrl-C", 1), \
        "silent and working: probed once"
    assert (engine.tick(), driver.interrupted) == ("probed, waiting", 1), "right after: waiting on the probe"
    engine.probed_at -= engine_module.PROBE_WAIT
    driver.tail = "› "
    driver.quiet = 1.0
    assert (engine.tick(), driver.interrupted) == ("probe: at the prompt, idle", 1), \
        "a prompt came back: marked idle, not probed again"
    engine.probed_at = 0
    driver.report = {"at": time.time() - 200, "event": "PreToolUse", "status": WORKING}
    driver.tail = ""
    driver.quiet = 200.0
    engine.tick()
    engine.probed_at -= engine_module.PROBE_WAIT
    assert engine.tick() == "probe: nothing came back, stopped", "nothing came back: marked stopped"
    driver.report = {"at": time.time(), "event": "PostToolUse", "status": WORKING}
    driver.quiet = 1.0
    assert (engine.tick() != "silent for two minutes: probing with Ctrl-C") is True, "a fresh report: no probe"

    driver.report = {"at": time.time(), "event": "SessionStart", "status": IDLE, "session": "s-old"}
    Sessions(root).bind("s-old", "elsewhere")
    assert (engine.tick(), engine.record.env) == ("following the session to elsewhere", "elsewhere"), \
        "the engine moves to the session's environment"

    driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
    driver.quiet = 0.1
    engine.typed_at = 0
    engine.tick()
    engine.agent.pending_at -= 5
    engine.tick()
    driver.sent.clear()
    Todos(engine.record, actor=USER).create("a chore of its own")
    assert (engine.tick(), driver.sent, len(engine.agent.pending)) == ("delivered 1", [], 1), \
        "an ordinary event is collected and nothing is typed yet"
    assert (engine.tick(), driver.sent, len(engine.agent.pending)) == (BUSY, [], 1), \
        "a second tick within the quiet spell types nothing and collects nothing twice"
    engine.agent.pending_at -= 5
    assert (engine.tick(), driver.sent) == ("typed 1 in one line", ["1 new todo"]), \
        "five quiet seconds later the batch is typed as one counted line"
    engine.typed_at = 0
    driver.sent.clear()
    for i in range(10):
        Todos(engine.record, actor=USER).create(f"note {i}")
    assert (engine.tick(), driver.sent) == ("typed 10 in one line", ["10 new todos"]), \
        "ten waiting events are typed at once, without waiting for quiet"

    engine.typed_at = 0
    driver.sent.clear()
    Todos(engine.record, actor=USER).create("more noise")
    Messages(engine.record, actor=USER).create("but this is mine")
    assert (engine.tick(), driver.sent) == ("typed 2 in one line", ["1 new message", "1 new todo"]), \
        "a message riding with the noise still gets its own line, and does not wait for it"


def test_a_nudge_from_before_the_engine_was_born_is_read_as_stale_not_nagged():
    stale_record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
    stale_driver = Fake(stale_record)
    Agents(stale_record, actor=SYSTEM).by_session("fake-1")
    stale = Nudges(stale_record, actor=SYSTEM).create("work 9 open")
    stale_driver.report = {"at": time.time() + 1, "event": "Stop", "status": IDLE}
    stale_driver.quiet = 3.0
    stale_engine = Engine(stale_record, stale_driver)
    stale_engine.born = time.time() + 0.5
    stale_engine.tick()
    stale_engine.agent.pending_at -= 5
    stale_engine.tick()
    assert (AGENT in Nudges(stale_record).load(stale.n).seen, stale_driver.sent) == (True, []), \
        "a nudge from before the engine was born is marked read and not typed"
    stale_engine.typed_at = 0
    assert stale_engine.tick() == "nothing owed", "and nothing counts it as owed"


def test_engine_relays_what_other_processes_wrote_once_and_never_its_own_writes_twice():
    heard = []
    bus.on("*", lambda e, r: heard.append(e.id))
    relay_record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
    relay_driver = Fake(relay_record)
    relay_driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
    relay_engine = Engine(relay_record, relay_driver)
    relay_engine.tick()
    foreign = relay_record.emit("todo", 1, "created", USER)
    lines = (relay_record.home / "events.jsonl").read_text().splitlines()
    lines[-1] = json.dumps({**json.loads(lines[-1]), "pid": 1, "heard": False})
    (relay_record.home / "events.jsonl").write_text("\n".join(lines) + "\n")
    heard.clear()
    relay_engine.tick()
    assert heard == [foreign.id], "an event written by a process without the features — the hook — reaches the engine's bus once"
    heard.clear()
    relay_engine.tick()
    assert heard == [], "and not again"
    own = relay_record.emit("todo", 2, "created", USER)
    lines = (relay_record.home / "events.jsonl").read_text().splitlines()
    lines[-1] = json.dumps({**json.loads(lines[-1]), "pid": 1})
    (relay_record.home / "events.jsonl").write_text("\n".join(lines) + "\n")
    heard.clear()
    relay_engine.tick()
    assert (own.heard, heard) == (True, []), "an event another process's features already heard — the CLI's, the viewer's — is not relayed"
    relay_record.emit("todo", 2, "created", USER)
    heard.clear()
    relay_engine.tick()
    assert heard == [], "the engine's own emit is not relayed a second time"
    bus.clear()


def test_typing_holds_delivery_a_stale_session_is_woken_once_and_an_aside_reads_the_drivers_quiet():
    root = Path(tempfile.mkdtemp()) / ".journal"
    record = Record(root, "main")
    driver = Fake(record)
    engine = Engine(record, driver)
    driver.report = None
    (root / "runtime").mkdir(parents=True, exist_ok=True)
    driver.typed.touch()
    assert engine.typing() == "holding: the user is typing in the terminal", \
        "a keystroke moments ago holds everything the engine would type"
    assert TYPING_HOLD == 10.0, "the hold is ten seconds, not half a minute"
    old = time.time() - TYPING_HOLD - 1
    os.utime(driver.typed, (old, old))
    cleared = []
    driver.clear_input = lambda: cleared.append(True)
    assert (engine.typing(), cleared, driver.typed.exists()) == ("", [True], False), \
        "a draft untouched past the hold no longer holds it, and is cleared before the engine types"
    assert (engine.typing(), len(cleared)) == ("", 1), "after the user pressed Enter nothing holds and nothing is cleared"

    waking = Fake(record)
    started = Engine(record, waking)
    started.born = time.time()
    assert (started.begin(), waking.sent) == ("", []), "while it may still be starting, nothing is typed"
    started.born = time.time() - WAIT_FOR_REPORT - 1
    assert (started.begin(), waking.sent) == ("typed the opening line", [hello("main")]), \
        "once it has had its time at the prompt with nothing reported, it is woken"
    assert (started.begin(), len(waking.sent)) == ("", 1), "and only once"
    spoke = Fake(record)
    spoke.born = time.time() - WAIT_FOR_REPORT - 1
    spoke.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
    awake = Engine(record, spoke)
    awake.born = time.time() - WAIT_FOR_REPORT - 1
    assert (awake.begin(), spoke.sent) == ("", []), "a session that has reported is left alone"

    record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
    driver = Fake(record)
    agent = Agent(record, driver)
    driver.__class__.ASIDE = "/btw {line}"
    driver.quiet_for = lambda: 0.2
    assert agent.aside("2 new messages") == "/btw 2 new messages", "a line delivered while it works is an aside"
    driver.quiet_for = lambda: 9.0
    assert agent.aside("2 new messages") == "2 new messages", "a line delivered at rest is said plainly"
    driver.__class__.ASIDE = ""
    assert agent.aside("2 new messages") == "2 new messages", "a CLI with no aside always says it plainly"

    launching = Claude(record, "launch")
    assert launching.command(["--continue"])[:3] == ["claude", "--settings", '{"crossSessionInbound": "accept"}'], \
        "the journal launches claude ready to accept its messages"
    assert launching.command(["--settings", "mine.json"])[-2:] == ["--settings", "mine.json"], \
        "a settings argument of the user's own is left alone"
    assert launching.command([])[-2:] == ["--dangerously-load-development-channels", "server:journal"], \
        "and it loads the journal's own channel"
    warned = b"WARNING: --dangerously-load-development-channels is for local development\n1. I am using this\n2. Exit"
    assert Claude.confirm(warned) == b"\r", "the journal answers for the flag it passed"
    assert Claude.confirm(b"\x1b[31mSOME\x1b[0m\x1b[3;9Hentirely\x1b[3;17Hnew\x1b[3;29Hwording --dangerously-load-development-channels\n1. go on\n2. Exit") == b"\r", \
        "it knows the prompt by the flag it passed rather than by the words around it"
    assert Claude.confirm(b"--dangerously-load-development-channels is for local development only.") == b"", \
        "the flag alone, before the choice is drawn, is not answered"
    assert Claude.confirm(b"1. one\n2. two") == b"", "and a choice that is not about our flag is not answered"
    assert Claude.confirm(b"an ordinary line of output") == b"", "and answers nothing else"
    assert Codex.confirm(warned) == b"", "a driver that never passes the flag never answers"
    assert launching.handed("x") is False, "with the channel not listening, a line is not handed to it"
    (record.root / "runtime").mkdir(exist_ok=True)
    (record.root / "runtime" / "channel.on").touch()
    assert (launching.handed("a notice"), json.loads((record.root / "runtime" / "channel.jsonl").read_text().splitlines()[-1])["content"]) == \
        (True, "a notice"), "with the channel listening, the line is queued for it"

    inbox = Path(tempfile.mkdtemp()) / "inbox.sock"
    listener = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    listener.bind(str(inbox))
    listener.listen(1)
    posted = []

    class Posting(Fake):
        def send(self, text):
            return Driver.send(self, text)

        def type_in(self, line):
            self.sent.append(line)
            return True

    posting = Posting(record)
    assert (posting.send("nothing to post to"), posting.sent) == (True, ["nothing to post to"]), \
        "with no socket on the row the line is typed"
    elsewhere = Posting(record)
    elsewhere.session = "a-name-no-row-has"
    assert elsewhere.inbox() == "", "a driver whose own session has no row still finds the live one's socket"
    Agents(record, actor=SYSTEM).saw(Agents(record, actor=SYSTEM).by_session("fake-1").n, {}, inbox=str(inbox))
    posting.sent.clear()
    assert (posting.send("over the socket"), posting.sent) == (True, []), "with a socket the line is posted, not typed"
    conn, _ = listener.accept()
    posted.append(json.loads(conn.recv(4096).decode().strip()))
    conn.close()
    assert posted[0] == {"type": "user", "message": {"role": "user", "content": "The journal, for the user:\nover the socket"}}, \
        "the frame names the line as a user message, and the line says who is writing"

    record.delivery = {"socket": False}
    posting.sent.clear()
    assert (posting.send("typed instead"), posting.sent) == (True, ["typed instead"]), \
        "with the socket switched off the line is typed instead"
    record.delivery = {}
    posting.sent.clear()
    listener.close()
    inbox.unlink()
    assert (posting.send("after it closed"), posting.sent) == (True, ["after it closed"]), \
        "a socket that has gone falls back to typing"

    class Typing(Fake):
        def send(self, text):
            return Driver.send(self, text)

        def last_printed(self):
            return "❯ "

    read, write = os.pipe()
    typing = Typing(record)
    typing.fd = write
    line = "a line far longer than one short write would ever carry to the terminal"
    sent = typing.type_in(line)
    os.close(write)
    raw = b""
    while chunk := os.read(read, 4096):
        raw += chunk
    os.close(read)
    assert (sent, raw.startswith(Driver.CLEAR_LINE), line.encode() in raw, raw.endswith(b"\r")) == (True, True, True, True), \
        "the whole line reaches the terminal, and the box is cleared before it"

    driver.lands = False
    lost = Messages(record, actor=USER).create("one that never lands")
    engine.agent.pending_at -= 5
    engine.tick()
    assert Messages(record, actor=SYSTEM).load(lost.n).data.get("delivered") is None, \
        "a line that never left the input box stamps nothing"

    ran = subprocess.run([sys.executable, str(Path(__file__).resolve().parents[1] / "engine" / "supervisor.py")],
                         capture_output=True, text=True, cwd=tempfile.mkdtemp(), timeout=30)
    assert ("ModuleNotFoundError" in ran.stderr, "sys.argv" in ran.stderr) == (False, True), \
        "the supervisor imports cleanly when started as a script"

    assert (release().startswith(b"\x1b[r"), all(f"[{n};1H".encode() in release() for n in range(1, ROWS + 1))) == (True, True), \
        "letting the band go clears the rows it painted, not only its region"
