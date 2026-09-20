import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.base import COMMANDS  # noqa: E402
from controllers.types import Todos, Works  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402
from features import FEATURES  # noqa: E402
from features.base import held  # noqa: E402
from tests.features.kit import idle, nudges, report  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

features.unload()
features.load()

# WORK STARTED FOR A TO-DO links the two and marks the row started, as SYSTEM
record = fresh()
todos = Todos(record, actor=USER)
works = Works(record, actor=AGENT)
todo = todos.create("a row to work")
work = works.create("the work for it", todo=todo.n)
check("work created for a to-do: linked to it", works.load(work.n).refs, [todo.ref])
check("the to-do says it is started, and by which work", (todos.load(todo.n).data.get("status"), todos.load(todo.n).data.get("work")), ("started", work.n))
check("the link and the status were the feature's acts, as SYSTEM", [(e.type, e.action, e.actor) for e in record.events() if e.type != "notification"][2:],
      [("work", "linked", SYSTEM), ("todo", "updated", SYSTEM)])

# WORK ENDED closes the row only when told to
works.complete(work.n, "done")
check("work ended without --todo: the row stays open", todos.load(todo.n).completed, 0.0)
work2 = works.create("again", todo=todo.n)
works.complete(work2.n, "done", todo=True)
check("work ended --todo: the row is completed by SYSTEM, citing the work", (bool(todos.load(todo.n).completed), record.events()[-1].actor, record.events()[-1].data["how"]),
      (True, SYSTEM, f"work {work2.n} ended"))
check("work cannot start for a completed row", refused(lambda: works.create("once more", todo=todo.n)), f"todo {todo.n} is already done")
check("the refusal creates no work or to-do event", (len(works.all()), [e.action for e in record.events() if e.type == "todo"].count("completed")), (2, 1))
plain = works.create("work with no to-do")
check("work with no to-do: the feature does nothing", [e for e in record.events() if e.n == plain.n and e.type == "work"][-1].action, "created")
works.complete(plain.n, "done")

# ON IDLE the open work is said, once per idle stretch
record = fresh()
idle(record)
check("nothing open: nothing said", nudges(record), [])
works = Works(record, actor=AGENT)
works.create("the header")
idle(record)
idle(record)
check("open work with an empty log is said at each idle, asking for the log", nudges(record), ["work 1 open, nothing logged", "work 1 open, nothing logged"])
works.action("log")("Chose the header, because the footer waits on it")
idle(record)
check("once logged, the open work is said plainly", nudges(record)[-1], "work 1 open")
entry = works.load(1).sections[0]
check("a log entry is the message under its number and the time it was written", (entry["body"], entry["title"][:4], len(entry["title"])), ("Chose the header, because the footer waits on it", "1 · ", 20))
works.action("log")("Then the footer")
check("each entry is its own section", len(works.load(1).sections), 2)

# EDITS without a log entry hold the writes until the work is logged
record = fresh()
record.set_setting("work", {"log_after": 3})
works = Works(record, actor=AGENT)
works.create("editing")
report(record, "working", "PostToolUse", wrote=True)
report(record, "working", "PostToolUse", wrote=True)
check("under the limit: nothing held", held(record, "claude-1"), "")
report(record, "working", "PostToolUse", wrote=False)
check("a read is not an edit", held(record, "claude-1"), "")
report(record, "working", "PostToolUse", wrote=True)
check("at the limit the writes are held, naming the command", "journal work log" in held(record, "claude-1"), True)
works.action("log")("Three edits in")
check("a log entry releases the hold", held(record, "claude-1"), "")
report(record, "working", "PostToolUse", wrote=True)
check("and the count starts over", held(record, "claude-1"), "")

# SWITCHED OFF per environment
record = fresh()
record.set_setting("features", {"work": False})
todo = Todos(record, actor=USER).create("a row")
work = Works(record, actor=AGENT).create("work", todo=todo.n)
check("work switched off: nothing is linked", Works(record).load(work.n).refs, [])
check("its log command refuses while the feature is off", refused(lambda: Works(record, actor=AGENT).action("log")(work.n, "x")), "the work feature is off")

# THE LOG COMMAND is the feature's own, reached by its word like any other
check("work log is registered by the feature, not the controller", ("log" in COMMANDS["work"], hasattr(Works, "log")), (True, False))

# PARKED WORK is set aside with no clock: it stays open, stops being nudged, and the next log entry picks it up
parking = Works(record, actor=AGENT)
for open_row in [w for w in parking.all() if not w.completed]:
    parking.complete(open_row.n, "tidied for the next check")
aside = parking.create("something that waits on the user")
FEATURES["work"].park(parking, "the question is with the user", aside.n)
check("parked work says why, stays open, and is not work in hand",
      (parking.load(aside.n).parked, bool(parking.load(aside.n).completed),
       [w.n for w in FEATURES["work"].working(record) if w.n == aside.n]),
      ("the question is with the user", False, []))
FEATURES["work"].resume(parking, aside.n)
check("resume picks it up again",
      (parking.load(aside.n).parked, [w.n for w in FEATURES["work"].working(record) if w.n == aside.n]), ("", [aside.n]))

# ONE PIECE OF WORK IN HAND: a second is refused until the first is ended or parked, and log means the one in hand
alone = Works(record, actor=AGENT)
for w in alone.all():
    if not w.completed:
        alone.complete(w.n, "tidied for the next check")
first = alone.create("the first thing")
check("a second piece of work is refused while one is open", "is open" in refused(lambda: alone.create("the second thing")), True)
FEATURES["work"].log(alone, "a turn, with no number")
check("a log entry with no number lands on the work in hand", [s["body"] for s in alone.load(first.n).sections], ["a turn, with no number"])
FEATURES["work"].park(alone, "waiting on the user")
second = alone.create("the second thing")
check("parked work lets the next one start", (alone.load(first.n).parked, alone.active().n), ("waiting on the user", second.n))
check("picking up parked work is refused while another is in hand",
      "end it or park it" in refused(lambda: FEATURES["work"].resume(alone, first.n)), True)
alone.complete(second.n, "done")
FEATURES["work"].resume(alone, first.n)
check("resume picks the parked one up", (alone.load(first.n).parked, alone.active().n), ("", first.n))
check("a log entry aimed at work that is not in hand is refused",
      "the one in hand" in refused(lambda: FEATURES["work"].log(alone, "x", second.n)), True)

done()
