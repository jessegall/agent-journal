import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Notifications, Reports, Todos  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()


def age(c, n, **fields):
    r = c.load(n)
    for k, v in fields.items():
        setattr(r, k, v)
    c.path(n).write_text(r.dump())


record = fresh()
reports = Reports(record, actor=AGENT)
todos = Todos(record, actor=USER)
fresh_report = reports.create("checked today")
old_report = reports.create("checked a month ago")
age(reports, old_report.n, created=time.time() - 30 * 86400)
open_row = todos.create("still open")
done_row = todos.create("done long ago")
todos.complete(done_row.n, "done")
age(todos, done_row.n, completed=time.time() - 10 * 86400)
report(record, "idle", "Stop")
check("a report past its keep days is archived, saying so", (bool(reports.load(old_report.n).completed), reports.load(old_report.n).outcome), (True, "aged out after 14 days"))
check("a fresh report stays", reports.load(fresh_report.n).completed, 0.0)
check("a to-do closed past its keep days is archived, an open one never", ([t.n for t in todos.all()], [e.data["why"] for e in record.events() if e.type == "todo" and e.action == "deleted"]), ([open_row.n], ["archived 7 days after it was closed"]))
# NOTIFICATIONS the user has seen go for good after their keep days; unseen ones stay
record = fresh()
notes = Notifications(record, actor=AGENT)
seen_old = notes.create("told long ago")
unseen_old = notes.create("never looked at")
seen_new = notes.create("told today")
for n in (seen_old.n, seen_new.n):
    Notifications(record, actor=USER).read(n)
age(notes, seen_old.n, created=time.time() - 5 * 86400)
age(notes, unseen_old.n, created=time.time() - 5 * 86400)
report(record, "idle", "Stop")
check("a seen notification past 3 days is removed; unseen and recent ones stay", sorted(r.n for r in notes.all(deleted=True)), [unseen_old.n, seen_new.n])

kept = fresh()
kept.set_setting("keep", {"report": 0})
r = Reports(kept, actor=AGENT).create("kept forever")
age(Reports(kept), r.n, created=time.time() - 300 * 86400)
report(kept, "idle", "Stop")
check("keep 0 leaves reports listed", Reports(kept).load(r.n).completed, 0.0)

done()
