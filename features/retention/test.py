import time


import features
from controllers.types import Notifications, Reports, Todos
from resources.base import AGENT, USER
from tests.kit import report
from tests.conftest import fresh


def age(c, n, **fields):
    r = c.load(n)
    for k, v in fields.items():
        setattr(r, k, v)
    c.path(n).write_text(r.dump())


def test_reports_and_todos_past_their_keep_days_are_archived_open_ones_never():
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
    assert (bool(reports.load(old_report.n).completed), reports.load(old_report.n).outcome) == (True, "aged out after 14 days"), \
        "a report past its keep days is archived, saying so"
    assert reports.load(fresh_report.n).completed == 0.0, "a fresh report stays"
    assert ([t.n for t in todos.all()], [e.data["why"] for e in record.events() if e.type == "todo" and e.action == "deleted"]) == \
        ([open_row.n], ["archived 7 days after it was closed"]), "a to-do closed past its keep days is archived, an open one never"


def test_seen_notifications_past_their_keep_days_go_unseen_ones_stay():
    record = fresh()
    notes = Notifications(record, actor=AGENT)
    seen_old = notes.create("told long ago")
    unseen_old = notes.create("never looked at")
    seen_new = notes.create("told today")
    for n in (seen_old.n, seen_new.n):
        Notifications(record, actor=USER).read(n)
    age(notes, seen_old.n, created=time.time() - 2 * 86400)
    age(notes, unseen_old.n, created=time.time() - 2 * 86400)
    report(record, "idle", "Stop")
    assert sorted(r.n for r in notes.all(deleted=True, completed=True)) == [unseen_old.n, seen_new.n], \
        "a seen notification past a day is removed entirely; unseen and recent ones stay"


def test_keep_zero_leaves_reports_listed():
    kept = fresh()
    kept.set_setting("keep", {"report": 0})
    r = Reports(kept, actor=AGENT).create("kept forever")
    age(Reports(kept), r.n, created=time.time() - 300 * 86400)
    report(kept, "idle", "Stop")
    assert Reports(kept).load(r.n).completed == 0.0, "keep 0 leaves reports listed"
