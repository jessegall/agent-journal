import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
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
reports = CONTROLLERS["report"](record, actor=AGENT)
todos = CONTROLLERS["todo"](record, actor=USER)
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
kept = fresh()
kept.set_setting("keep", {"report": 0})
r = CONTROLLERS["report"](kept, actor=AGENT).create("kept forever")
age(CONTROLLERS["report"](kept), r.n, created=time.time() - 300 * 86400)
report(kept, "idle", "Stop")
check("keep 0 leaves reports listed", CONTROLLERS["report"](kept).load(r.n).completed, 0.0)

done()
