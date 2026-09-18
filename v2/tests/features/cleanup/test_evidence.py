import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from v2 import features  # noqa: E402
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.features.cleanup.query import evidence, read, read_owed  # noqa: E402
from v2.resources.base import AGENT, USER  # noqa: E402
from v2.tests.features.kit import nudges, report  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
project = record.root.parent
(project / "v2").mkdir()
(project / "v2" / "serve.py").write_text("")
pins = CONTROLLERS["pin"](record, actor=AGENT)
rules = CONTROLLERS["rule"](record, actor=USER)
pins.create("the server is v2/serve.py")
pins.create("the launcher was launch.py", brief="see old/launch.py for the relay")
rules.create("close a row with journal todo done", brief="never with journal frobnicate 4")
CONTROLLERS["reminder"](record, actor=USER).create("run tests/old.py first")
check("nothing wrong with a claim whose file exists and whose verbs are known", [e["ref"] for e in evidence(record) if e["ref"] == "pin:1"], [])
found = evidence(record)
check("a claim naming a file that is gone", [(e["ref"], e["evidence"]) for e in found if e["ref"] == "pin:2"], [("pin:2", "names launch.py, which is gone"), ("pin:2", "names old/launch.py, which is gone")])
check("a claim naming a verb the CLI lacks, with the command that retires it", [(e["evidence"], e["retire"]) for e in found if e["ref"] == "rule:1"], [("names journal frobnicate, which the CLI does not answer to", 'journal rule 1 strike "<why>"')])
check("a reminder naming a missing file", [e["evidence"] for e in found if e["ref"] == "reminder:1"], ["names tests/old.py, which is gone"])
pins.complete(2, "struck")
check("a struck claim has no evidence", [e for e in evidence(record) if e["ref"] == "pin:2"], [])

# A ROW WAITING ON THE USER too long
todos = CONTROLLERS["todo"](record, actor=USER)
row = todos.create("stuck")
q = CONTROLLERS["question"](record, actor=AGENT).create("which way", about=row.ref)
check("a fresh question is not evidence", [e for e in evidence(record) if e["ref"] == row.ref], [])
questions = CONTROLLERS["question"](record, actor=AGENT)
old = questions.load(q.n)
old.created = time.time() - 8 * 86400
questions.path(q.n).write_text(old.dump())
check("eight days waiting: evidence", [e["evidence"] for e in evidence(record) if e["ref"] == row.ref], ["waiting on the user for over 7 days (question 1)"])

# THE READING PASS is owed until done, and records when it ran
check("never read: owed", read_owed(record), True)
got = read(record)
check("read returns every standing rule and pin in full", sorted(r.ref for r in got), ["pin:1", "rule:1"])
check("read: no longer owed", read_owed(record), False)

# SAID ONCE A DAY
report(record, "idle", "Stop")
check("the first report says what has evidence, with the retiring commands under it", nudges(record)[0].startswith("3 things in the record have evidence against them"), True)

done()
