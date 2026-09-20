import json
import os
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Agents, Messages, Nudges, Pins, Questions, Todos, Works  # noqa: E402
from engine import bus  # noqa: E402
from engine.actors import Agent, BUSY, IDLE, STOPPED, WORKING, User  # noqa: E402
from engine.drivers import Driver  # noqa: E402
from engine.engine import Engine, TYPING_HOLD  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.sessions import ACTIVE_ENV  # noqa: E402
from engine.terminal import agent_environment  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402
from resources.types import PRIORITY, TYPES  # noqa: E402
from resources.types import AgentRow  # noqa: E402
from tests.kit import check, done  # noqa: E402



class Fake(Driver):
    name = "fake"

    def __init__(self, record):
        super().__init__(record, "fake-1", fd=1)
        self.sent = []
        self.report = None
        self.quiet = 10.0
        self.up = True

    def command(self, args):
        return ["true"]

    def alive(self):
        return self.up

    def send(self, text):
        self.sent.append(text)

    def last_report(self):
        return AgentRow(title=self.report.pop("session", ""), data=self.report) if self.report else None

    def quiet_for(self):
        return self.quiet

    def last_printed(self):
        return "❯ "


root = Path(tempfile.mkdtemp()) / ".journal"
record = Record(root, "main")
driver = Fake(record)
engine = Engine(record, driver)
engine.start()
check("start puts the engine in its loop; stop takes it out", (engine.running, (engine.stop(), engine.running)[1]), (True, False))
check("the launcher marks only the child agent environment as journal-managed", agent_environment({"PATH": "/bin"}), {"PATH": "/bin", ACTIVE_ENV: "1"})

# STATE, read from the driver's reports and quiet
driver.up = False
check("no driver alive: stopped", engine.agent.state(), STOPPED)
driver.up = True
driver.report = None
driver.quiet = 0.2
check("no reports yet, printing without declared work: busy", engine.agent.state(), BUSY)
driver.quiet = 4.0
check("no reports yet, quiet: idle", engine.agent.state(), IDLE)
driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
driver.quiet = 6.0
check("a tool call under way without declared work: busy", engine.agent.state(), BUSY)
driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
driver.quiet = 2.0
check("a Stop and quiet: idle", (engine.agent.state(), engine.agent.is_idle()), (IDLE, True))
driver.report = {"at": time.time(), "event": "SessionStart", "status": IDLE}
check("a SessionStart is idle too", engine.agent.is_idle(), True)
driver.report = {"at": time.time(), "event": "PostToolUse", "status": WORKING}
check("between tool calls without declared work: busy", engine.agent.state(), BUSY)

# EVERY EVENT REACHES EVERY ACTOR BUT ITS OWN. The user writes a message: the agent is typed to at once,
# working or not; the user is not notified of their own act. The agent completes it: the user is notified.
driver.report = None
Messages(record, actor=USER).create("look at the header")
check("nothing is delivered before the agent's first report: it may be at a dialog", (engine.tick(), driver.sent), ("waiting for the agent's first report", []))
driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
driver.quiet = 0.1
check("before a tick nothing is typed", driver.sent, [])
why = engine.tick()
check("the tick collects the user's event for the agent, typing nothing yet", (why, driver.sent), ("delivered 1", []))
check("the user is not notified of their own event", User(record).unread(), [])
check("a second tick within the quiet spell types nothing and collects nothing twice", (engine.tick(), driver.sent, len(engine.agent.pending)), (BUSY, [], 1))
engine.agent.pending_at -= 5
check("five quiet seconds later the batch is typed as one counted line", (engine.tick(), driver.sent), ("typed 1 in one line", ["1 new message"]))
check("the cursor moved: a further tick types nothing more", (engine.tick(), len(driver.sent)), (BUSY, 1))
driver.sent.clear()
Messages(record, actor=AGENT).complete(1, "read and filed")
engine.tick()
check("the agent's completion reaches the user as a notification and not the agent", ([n.refs[0] for n in User(record).unread()], driver.sent), (["message:1"], []))

# THE NUDGE: only idle, and in priority order — unread resources first; open work and the next to-do are features
def settle():                                          # deliver whatever is pending, then read the nudge alone
    engine.tick()
    engine.agent.pending_at -= 5
    engine.tick()
    engine.typed_at = 0
    driver.sent.clear()
    return engine.tick()


driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
driver.quiet = 3.0
Todos(record, actor=USER).create("a chore")
Questions(record, actor=USER).create("which colour")
settle()
check("idle with unread resources: the highest priority type first, with its numbers", driver.sent[-1] == "1 unread question", True)
Questions(record, actor=AGENT).read(1)
settle()
check("the question seen: the to-do is next in priority", driver.sent[-1] == "1 unread todo", True)
Todos(record, actor=AGENT).read(1)
why = settle()
check("everything seen: nothing owed", (why, driver.sent), ("nothing owed", []))
Works(record, actor=AGENT).create("the header")
driver.report = {"at": time.time(), "event": "PostToolUse", "status": WORKING}
check("active with declared work: working", engine.agent.state(), WORKING)
driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
driver.quiet = 3.0
why = settle()
check("the agent's own work is not owed to it by the engine: that is the work feature's nudge", (why, driver.sent), ("nothing owed", []))
Nudges(record, actor=SYSTEM).create("work 1 open")
driver.sent.clear()
engine.tick()
engine.agent.pending_at -= 5
driver.report = {"at": time.time() - 100, "event": "Stop", "status": IDLE}
engine.tick()
engine.tick()
check("a line typed a moment ago is not followed by a nudge before the hooks report", (engine.why, driver.sent), ("typed, waiting for the hooks", ["work 1 open"]))
check("the priority order is messages first", PRIORITY[0], "message")

# THE SEAT RECORD
seat = json.loads((root / "runtime" / "seat-fake-1.json").read_text())
check("the seat record says the agent, its state and the last decision", (seat["agent"], seat["state"], seat["why"]), ("fake", IDLE, "typed, waiting for the hooks"))

# THE BUS hears every emit
heard = []
bus.on("*", lambda e, r: heard.append((e.type, e.action)))
Pins(record, actor=USER).create("a fact")
check("record.emit reaches the bus", heard[-1], ("pin", "created"))
bus.clear()

# A NUDGE is spoken to the agent as its own words, and the user never hears it
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
check("a nudge is typed as its title and brief, not as type n action", driver.sent, ["2 reminders standing, read them — 1. run the suites"])
check("the user is not notified of a nudge", len(User(record).unread()), before)
check("an agent row's events reach nobody: only the nudge was typed", ("agent" in [e.type for e in record.events()], len(driver.sent)), (True, 1))

# THE PROBE: two silent minutes while working earn one Ctrl-C; what comes back decides
from engine import engine as engine_module  # noqa: E402
check("a github ssh remote becomes the branch's web home; an unknown host is not guessed at",
      (engine_module.web_remote("git@github.com:me/repo.git"), engine_module.web_remote("https://example.com/me/repo.git")), ("https://github.com/me/repo", ""))
driver.sent.clear()
driver.interrupted = 0
driver.interrupt = lambda: setattr(driver, "interrupted", driver.interrupted + 1)
driver.report = {"at": time.time() - 200, "event": "PreToolUse", "status": WORKING}
driver.quiet = 200.0
driver.tail = "still printing"
driver.at_prompt = lambda: "›" in driver.tail
engine.typed_at = 0
check("silent and working: probed once", (engine.tick(), driver.interrupted), ("silent for two minutes: probing with Ctrl-C", 1))
check("right after: waiting on the probe", (engine.tick(), driver.interrupted), ("probed, waiting", 1))
engine.probed_at -= engine_module.PROBE_WAIT
driver.tail = "› "
driver.quiet = 1.0
check("a prompt came back: marked idle, not probed again", (engine.tick(), driver.interrupted), ("probe: at the prompt, idle", 1))
engine.probed_at = 0
driver.report = {"at": time.time() - 200, "event": "PreToolUse", "status": WORKING}
driver.tail = ""
driver.quiet = 200.0
engine.tick()
engine.probed_at -= engine_module.PROBE_WAIT
check("nothing came back: marked stopped", engine.tick(), "probe: nothing came back, stopped")
driver.report = {"at": time.time(), "event": "PostToolUse", "status": WORKING}
driver.quiet = 1.0
check("a fresh report: no probe", engine.tick() != "silent for two minutes: probing with Ctrl-C", True)

# THE ENGINE RELAYS what other processes wrote to its own features, once, and never its own writes twice
import json as _json  # noqa: E402
heard = []
bus.on("*", lambda e, r: heard.append(e.id))
relay_record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
relay_driver = Fake(relay_record)
relay_driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
relay_engine = Engine(relay_record, relay_driver)
relay_engine.tick()
foreign = relay_record.emit("todo", 1, "created", USER)
lines = (relay_record.home / "events.jsonl").read_text().splitlines()
lines[-1] = _json.dumps({**_json.loads(lines[-1]), "pid": 1, "heard": False})
(relay_record.home / "events.jsonl").write_text("\n".join(lines) + "\n")
heard.clear()
relay_engine.tick()
check("an event written by a process without the features — the hook — reaches the engine's bus once", heard, [foreign.id])
heard.clear()
relay_engine.tick()
check("and not again", heard, [])
own = relay_record.emit("todo", 2, "created", USER)
lines = (relay_record.home / "events.jsonl").read_text().splitlines()
lines[-1] = _json.dumps({**_json.loads(lines[-1]), "pid": 1})
(relay_record.home / "events.jsonl").write_text("\n".join(lines) + "\n")
heard.clear()
relay_engine.tick()
check("an event another process's features already heard — the CLI's, the viewer's — is not relayed", (own.heard, heard), (True, []))
relay_record.emit("todo", 2, "created", USER)
heard.clear()
relay_engine.tick()
check("the engine's own emit is not relayed a second time", heard, [])
bus.clear()

# THE ENGINE FOLLOWS ITS SESSION: a resumed session bound to another environment takes the engine there
from engine.sessions import Sessions  # noqa: E402
driver.report = {"at": time.time(), "event": "SessionStart", "status": IDLE, "session": "s-old"}
Sessions(root).bind("s-old", "elsewhere")
check("the engine moves to the session's environment", (engine.tick(), engine.record.env), ("following the session to elsewhere", "elsewhere"))

# A NUDGE IS SPOKEN ONCE, NEVER COUNTED: one missed by a restarted engine is read as stale, not nagged as "n unread nudge"
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
check("a nudge from before the engine was born is marked read and not typed", (AGENT in Nudges(stale_record).load(stale.n).seen, stale_driver.sent), (True, []))
stale_engine.typed_at = 0
check("and nothing counts it as owed", stale_engine.tick(), "nothing owed")

# A BATCH: ten waiting events are typed at once, one counted line, without waiting for the quiet spell
driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
driver.quiet = 0.1
engine.typed_at = 0
engine.tick()
engine.agent.pending_at -= 5
engine.tick()
driver.sent.clear()
for i in range(10):
    Messages(engine.record, actor=USER).create(f"note {i}")
check("ten waiting events are typed at once, without waiting for quiet", (engine.tick(), driver.sent), ("typed 10 in one line", ["10 new messages"]))

# THE USER TYPING IN THE TERMINAL holds the engine's typing, until the draft has sat untouched for a while
root = Path(tempfile.mkdtemp()) / ".journal"
record = Record(root, "main")
driver = Fake(record)
engine = Engine(record, driver)
driver.report = None
(root / "runtime").mkdir(parents=True, exist_ok=True)
driver.typed.touch()
check("a keystroke moments ago holds everything the engine would type", engine.typing(), "holding: the user is typing in the terminal")
check("the hold is ten seconds, not half a minute", TYPING_HOLD, 10.0)
old = time.time() - TYPING_HOLD - 1
os.utime(driver.typed, (old, old))
cleared = []
driver.clear_input = lambda: cleared.append(True)
check("a draft untouched past the hold no longer holds it, and is cleared before the engine types", (engine.typing(), cleared, driver.typed.exists()), ("", [True], False))
check("after the user pressed Enter nothing holds and nothing is cleared", (engine.typing(), len(cleared)), ("", 1))

# A SESSION THAT NEVER REPORTS is woken once, so it does not sit there until the user types
from features.start.feature import WAIT_FOR_REPORT, hello  # noqa: E402
waking = Fake(record)
started = Engine(record, waking)
started.born = time.time()
check("while it may still be starting, nothing is typed", (started.begin(), waking.sent), ("", []))
started.born = time.time() - WAIT_FOR_REPORT - 1
check("once it has had its time at the prompt with nothing reported, it is woken", (started.begin(), waking.sent), ("typed the opening line", [hello("main")]))
check("and only once", (started.begin(), len(waking.sent)), ("", 1))
spoke = Fake(record)
spoke.born = time.time() - WAIT_FOR_REPORT - 1
spoke.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
awake = Engine(record, spoke)
awake.born = time.time() - WAIT_FOR_REPORT - 1
check("a session that has reported is left alone", (awake.begin(), spoke.sent), ("", []))

# A LINE OWED WHILE THE AGENT IS WORKING goes in as the CLI's own aside, not as the next turn's prompt
record = Record(Path(tempfile.mkdtemp()) / ".journal", "main")
driver = Fake(record)
agent = Agent(record, driver)
driver.__class__.ASIDE = "/btw {line}"
driver.quiet_for = lambda: 0.2
check("a line delivered while it works is an aside", agent.aside("2 new messages"), "/btw 2 new messages")
driver.quiet_for = lambda: 9.0
check("a line delivered at rest is said plainly", agent.aside("2 new messages"), "2 new messages")
driver.__class__.ASIDE = ""
check("a CLI with no aside always says it plainly", agent.aside("2 new messages"), "2 new messages")

done()
