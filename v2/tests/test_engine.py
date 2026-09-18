import json
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.engine import bus  # noqa: E402
from v2.engine.actors import IDLE, STOPPED, WAITING, WORKING, User  # noqa: E402
from v2.engine.drivers import Driver  # noqa: E402
from v2.engine.engine import Engine  # noqa: E402
from v2.engine.record import Record  # noqa: E402
from v2.resources.base import AGENT, SYSTEM, USER  # noqa: E402
from v2.resources.types import PRIORITY, TYPES  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


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
        return self.report

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

# STATE, read from the driver's reports and quiet
driver.up = False
check("no driver alive: stopped", engine.agent.state(), STOPPED)
driver.up = True
driver.report = None
driver.quiet = 0.2
check("no reports yet, printing: working", engine.agent.state(), WORKING)
driver.quiet = 4.0
check("no reports yet, quiet: idle", engine.agent.state(), IDLE)
driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
driver.quiet = 6.0
check("a tool call under way and quiet: waiting", engine.agent.state(), WAITING)
driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
driver.quiet = 2.0
check("a Stop and quiet: idle", (engine.agent.state(), engine.agent.is_idle()), (IDLE, True))
driver.report = {"at": time.time(), "event": "SessionStart", "status": IDLE}
check("a SessionStart is idle too", engine.agent.is_idle(), True)
driver.report = {"at": time.time(), "event": "PostToolUse", "status": WORKING}
check("between tool calls: working", engine.agent.is_working(), True)

# EVERY EVENT REACHES EVERY ACTOR BUT ITS OWN. The user writes a message: the agent is typed to at once,
# working or not; the user is not notified of their own act. The agent completes it: the user is notified.
driver.report = None
CONTROLLERS["message"](record, actor=USER).create("look at the header")
check("nothing is delivered before the agent's first report: it may be at a dialog", (engine.tick(), driver.sent), ("waiting for the agent's first report", []))
driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
driver.quiet = 0.1
check("before a tick nothing is typed", driver.sent, [])
why = engine.tick()
check("the tick delivers the user's event to the agent while it is working", (why, len(driver.sent), driver.sent[0] == "message 1 created"), ("delivered 1", 1, True))
check("the user is not notified of their own event", User(record).unread(), [])
check("the cursor moved: a second tick types nothing more", (engine.tick(), len(driver.sent)), (WORKING, 1))
CONTROLLERS["message"](record, actor=AGENT).complete(1, "read and filed")
engine.tick()
check("the agent's completion reaches the user as a notification and not the agent", ([n.data["about"] for n in User(record).unread()], len(driver.sent)), (["message:1"], 1))

# THE NUDGE: only idle, and in priority order — unseen resources first; open work and the next to-do are features
def settle():                                          # deliver whatever is pending, then read the nudge alone
    engine.tick()
    engine.typed_at = 0
    driver.sent.clear()
    return engine.tick()


driver.report = {"at": time.time(), "event": "Stop", "status": IDLE}
driver.quiet = 3.0
CONTROLLERS["todo"](record, actor=USER).create("a chore")
CONTROLLERS["question"](record, actor=USER).create("which colour")
settle()
check("idle with unseen resources: the highest priority type first, with its numbers", driver.sent[-1] == "1 unseen question", True)
CONTROLLERS["question"](record, actor=AGENT).see(1)
settle()
check("the question seen: the to-do is next in priority", driver.sent[-1] == "1 unseen todo", True)
CONTROLLERS["todo"](record, actor=AGENT).see(1)
why = settle()
check("everything seen: nothing owed", (why, driver.sent), ("nothing owed", []))
CONTROLLERS["work"](record, actor=AGENT).create("the header")
why = settle()
check("the agent's own work is not owed to it by the engine: that is the work feature's nudge", (why, driver.sent), ("nothing owed", []))
CONTROLLERS["nudge"](record, actor=SYSTEM).create("work 1 open")
driver.sent.clear()
engine.tick()
driver.report = {"at": time.time() - 100, "event": "Stop", "status": IDLE}
engine.tick()
check("a line typed a moment ago is not followed by a nudge before the hooks report", (engine.why, driver.sent), ("typed, waiting for the hooks", ["work 1 open"]))
check("the priority order is messages first", PRIORITY[0], "message")

# THE SEAT RECORD
seat = json.loads((root / "runtime" / "seat-fake-1.json").read_text())
check("the seat record says the agent, its state and the last decision", (seat["agent"], seat["state"], seat["why"]), ("fake", IDLE, "typed, waiting for the hooks"))

# THE BUS hears every emit
heard = []
bus.on("*", lambda e, r: heard.append((e.type, e.action)))
CONTROLLERS["pin"](record, actor=USER).create("a fact")
check("record.emit reaches the bus", heard[-1], ("pin", "created"))
bus.clear()

# A NUDGE is spoken to the agent as its own words, and the user never hears it
driver.report = {"at": time.time(), "event": "PreToolUse", "status": WORKING}
engine.tick()
driver.sent.clear()
CONTROLLERS["agent"](record, actor=SYSTEM).by_session("fake-1")
CONTROLLERS["nudge"](record, actor=SYSTEM).create("2 reminders standing, read them", brief="1. run the suites")
before = len(User(record).unread())
engine.tick()
check("a nudge is typed as its title and brief, not as type n action", driver.sent, ["2 reminders standing, read them — 1. run the suites"])
check("the user is not notified of a nudge", len(User(record).unread()), before)
check("an agent row's events reach nobody: only the nudge was typed", ("agent" in [e.type for e in record.events()], len(driver.sent)), (True, 1))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
