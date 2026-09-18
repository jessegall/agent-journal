import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from v2 import features  # noqa: E402
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.resources.base import SYSTEM, USER  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()


def report(record, status, event, **more):
    agents = CONTROLLERS["agent"](record, actor=SYSTEM)
    row = agents.by_session("claude-1")
    agents.update(row.n, **{**row.data, **more, "status": status, "event": event, "at": time.time()})


def nudges(record):
    return [(n.title, n.brief) for n in CONTROLLERS["nudge"](record).all()]


# ON IDLE, the default: the standing reminders are spoken once per idle stretch
record = fresh()
CONTROLLERS["reminder"](record, actor=USER).create("run the suites first")
CONTROLLERS["reminder"](record, actor=USER).create("say which environment")
report(record, "working", "PreToolUse")
check("working: nothing is said", nudges(record), [])
report(record, "idle", "Stop")
check("idle: one nudge naming every standing reminder", nudges(record), [("2 reminders standing, read them", "1. run the suites first; 2. say which environment")])
report(record, "idle", "Stop")
check("the same idle stretch: not said again", len(nudges(record)), 1)
report(record, "working", "PreToolUse")
report(record, "idle", "Stop")
check("the next idle: said again", len(nudges(record)), 2)
CONTROLLERS["reminder"](record, actor=USER).complete(1, "done")
report(record, "working", "PreToolUse")
report(record, "idle", "Stop")
check("a retired reminder is not repeated", nudges(record)[-1], ("1 reminder standing, read them", "2. say which environment"))

# NOTHING STANDING: nothing said
empty = fresh()
report(empty, "idle", "Stop")
check("no reminders: no nudge", nudges(empty), [])

# CONFIGURED BY UNIT: every 2 tool uses
record = fresh()
record.set_setting("triggers", {"reminders": {"every": 2, "unit": "uses"}})
CONTROLLERS["reminder"](record, actor=USER).create("keep going")
for uses in (1, 2, 3, 4):
    report(record, "working", "PreToolUse", uses=uses)
check("every 2 uses: said at 2 and at 4", len(nudges(record)), 2)
report(record, "idle", "Stop", uses=4)
check("idle no longer triggers it", len(nudges(record)), 2)

# EVERY 10 PERCENT of context: said when a mark is crossed
record = fresh()
record.set_setting("triggers", {"reminders": {"every": 10, "unit": "percent"}})
CONTROLLERS["reminder"](record, actor=USER).create("keep going")
for pct in (3, 9.9, 10, 14, 19, 20.5, 41):
    report(record, "working", "PostToolUse", context=pct)
check("10 percent marks: said at 10, 20 and 41", len(nudges(record)), 3)

# SWITCHED OFF: silent
record = fresh()
record.set_setting("features", {"reminders": False})
CONTROLLERS["reminder"](record, actor=USER).create("keep going")
report(record, "idle", "Stop")
check("feature off: nothing said", nudges(record), [])

done()
