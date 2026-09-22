import time


from controllers.types import Notifications, Nudges, Reports, Todos
from resources.base import AGENT, SYSTEM, USER, Refused
from tests.kit import tick
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
    tick(record)
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
    nudges = Nudges(record, actor=SYSTEM)
    old_line, new_line = nudges.create("said yesterday"), nudges.create("said just now")
    age(nudges, old_line.n, created=time.time() - 2 * 86400)
    tick(record)
    assert sorted(r.n for r in notes.all(deleted=True, completed=True)) == [unseen_old.n, seen_new.n], \
        "a seen notification past a day is removed entirely; unseen and recent ones stay"
    assert [r.n for r in nudges.all(deleted=True, completed=True)] == [new_line.n], "a nudge past a day is removed; it was said already"


def test_keep_zero_leaves_reports_listed():
    kept = fresh()
    kept.set_setting("keep", {"report": 0})
    r = Reports(kept, actor=AGENT).create("kept forever")
    age(Reports(kept), r.n, created=time.time() - 300 * 86400)
    tick(kept)
    assert Reports(kept).load(r.n).completed == 0.0, "keep 0 leaves reports listed"


def test_closed_rows_are_packed_into_a_zip_and_still_read_listed_reopened_and_removed():
    record = fresh()
    todos = Todos(record, actor=SYSTEM)
    rows = [todos.create(f"row {i}") for i in range(3)]
    for r in rows[:2]:
        todos.complete(r.n, how="done")
    folder = todos.path(rows[0].n).parent
    assert todos._pack(time.time() + 1) == 2, "only the closed rows are packed"
    assert (todos.path(rows[0].n).exists(), any((folder / "packed").glob("*.zip"))) == (False, True), "their files are gone into a zip"
    assert [r.title for r in (todos.load(rows[0].n), todos.load(rows[1].n))] == ["row 0", "row 1"], "a packed row reads straight from the zip"
    assert [row["n"] for row in todos.summaries()] == [r.n for r in rows], "and is still listed"
    assert todos.create("next").n == rows[2].n + 1, "a new row never takes a packed row's number"
    todos.reopen(rows[0].n, "again")
    assert (todos.path(rows[0].n).exists(), todos.load(rows[0].n).completed, [row["n"] for row in todos.summaries()].count(rows[0].n)) == (True, 0.0, 1), \
        "a packed row that changes is loose again, listed once"
    todos.force_delete(rows[1].n)
    try:
        todos.load(rows[1].n)
        raise AssertionError("a removed packed row is gone")
    except Refused:
        pass
    todos.complete(rows[0].n, how="done again")
    assert todos._pack(time.time() + 1) == 1 and todos.load(rows[0].n).completed, "packing into the same month again keeps the zip readable"
