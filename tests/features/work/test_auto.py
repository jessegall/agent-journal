import pytest

import features
from controllers.types import Questions, Todos, Works
from features.work.auto import QUIET_FOR, launch_args, still_there
from features.work.next import next, ready
from resources.base import AGENT, USER
from tests.kit import idle, nudges
from tests.conftest import fresh, refused


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_ready_rows_are_ordered_by_priority_then_by_number_skipping_what_is_not_ready():
    record = fresh()
    todos = Todos(record, actor=USER)
    a, b, c, d, e = (todos.create(t) for t in ("a", "b", "c", "d", "e"))
    assert next(record).n == a.n, "nothing set: the first row by number"
    todos.priority(c.n, "critical")
    assert [t.n for t in ready(record)] == [c.n, a.n, b.n, d.n, e.n], "a higher priority comes first"
    todos.priority(e.n, "high")
    todos.priority(b.n, "low")
    assert [t.n for t in todos.all()] == [c.n, e.n, a.n, d.n, b.n], "the list itself is ordered by priority, then number"
    assert refused(lambda: todos.priority(a.n, "urgent")) == "a priority is a number or one of low, default, high, critical", \
        "a priority is a level name or a number, nothing else"
    todos.priority(e.n, "default")
    todos.priority(b.n, "100")
    todos.set(c.n, "blocked", "the release is not cut")
    assert next(record).n == a.n, "a blocked row is skipped"
    todos.after(a.n, str(b.n))
    assert next(record).n == b.n, "a row waiting on an open row is skipped"
    todos.complete(b.n, "done")
    assert next(record).n == a.n, "its prerequisite closed, the row is ready again"
    Questions(record, actor=AGENT).create("which way", about=a.ref).n
    Questions(record, actor=AGENT).link(1, a.ref)
    assert next(record).n == d.n, "a row with an open question waits on the user"
    Questions(record, actor=USER).complete(1, "this way")
    assert next(record).n == a.n, "answered: the row is ready"
    for t in ready(record):
        todos.complete(t.n, "done")
    assert next(record) is None, "nothing ready: nothing"


def test_on_idle_with_auto_enabled_and_nothing_open_the_next_row_is_offered():
    record = fresh()
    todos = Todos(record, actor=USER)
    todos.create("first")
    todos.create("second")
    idle(record)
    assert nudges(record) == [], "auto off: nothing offered"
    features.FEATURES["auto"].enable(record)
    idle(record)
    assert nudges(record) == ["todo 1 next"], "auto on: the next row is offered once per idle stretch"
    assert launch_args(record, "claude", ["--model", "sonnet"]) == ["--permission-mode", "auto", "--model", "sonnet"], \
        "auto launches Claude with its automatic approval mode"
    assert launch_args(record, "codex", ["--model", "gpt-5"]) == ["--approve-for-me", "--model", "gpt-5"], \
        "auto launches Codex with its automatic approval mode"
    assert launch_args(record, "claude", ["--permission-mode=dontAsk"]) == ["--permission-mode=dontAsk"], \
        "an explicit Claude permission choice wins"
    assert launch_args(record, "codex", ["--ask-for-approval", "never"]) == ["--ask-for-approval", "never"], \
        "an explicit Codex approval choice wins"
    work = Works(record, actor=AGENT).create("on it", todo=1)
    idle(record)
    assert nudges(record) == ["todo 1 next", "work 1 open, nothing logged"], \
        "work open: nothing offered; the work feature speaks instead"
    Works(record, actor=AGENT).complete(work.n, "done", todo=True)
    idle(record)
    assert nudges(record)[-1] == "todo 2 next", "the row closed with the work: the next row is offered"


def test_an_agent_gone_quiet_with_work_open_is_asked_whether_it_is_still_working():
    quiet_record = fresh()
    quiet_record.features = {**quiet_record.features, "auto": True}
    Works(quiet_record, actor=AGENT).create("something still open")
    assert "still working" in still_there(quiet_record, QUIET_FOR + 60, "busy"), \
        "quiet for long enough, with work open and auto on, earns the question"
    assert [still_there(quiet_record, QUIET_FOR + 60, "idle"), still_there(quiet_record, 5.0, "busy")] == ["", ""], \
        "not while it is answering, not while it is idle, and not before the time is up"
    quiet_record.features = {**quiet_record.features, "auto": False}
    assert still_there(quiet_record, QUIET_FOR + 60, "busy") == "", "and never with auto off"
