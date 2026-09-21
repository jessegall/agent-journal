import pytest

import features
from controllers.base import COMMANDS
from controllers.types import Todos, Works
from resources.base import AGENT, SYSTEM, USER
from features import FEATURES
from features.base import held
from tests.features.kit import idle, nudges, report
from tests.conftest import fresh, refused


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_work_started_for_a_todo_links_the_two_and_ends_only_when_told():
    record = fresh()
    todos = Todos(record, actor=USER)
    works = Works(record, actor=AGENT)
    todo = todos.create("a row to work")
    work = works.create("the work for it", todo=todo.n)
    assert works.load(work.n).refs == [todo.ref], "work created for a to-do: linked to it"
    assert (todos.load(todo.n).data.get("status"), todos.load(todo.n).data.get("work")) == ("started", work.n), \
        "the to-do says it is started, and by which work"
    assert [(e.type, e.action, e.actor) for e in record.events() if e.type != "notification"][2:] == \
        [("work", "linked", SYSTEM), ("todo", "updated", SYSTEM)], "the link and the status were the feature's acts, as SYSTEM"

    works.complete(work.n, "done")
    assert todos.load(todo.n).completed == 0.0, "work ended without --todo: the row stays open"
    work2 = works.create("again", todo=todo.n)
    works.complete(work2.n, "done", todo=True)
    assert (bool(todos.load(todo.n).completed), record.events()[-1].actor, record.events()[-1].data["how"]) == \
        (True, SYSTEM, f"work {work2.n} ended"), "work ended --todo: the row is completed by SYSTEM, citing the work"
    assert refused(lambda: works.create("once more", todo=todo.n)) == f"todo {todo.n} is already done", \
        "work cannot start for a completed row"
    assert (len(works.all()), [e.action for e in record.events() if e.type == "todo"].count("completed")) == (2, 1), \
        "the refusal creates no work or to-do event"
    plain = works.create("work with no to-do")
    assert [e for e in record.events() if e.n == plain.n and e.type == "work"][-1].action == "created", \
        "work with no to-do: the feature does nothing"
    works.complete(plain.n, "done")


def test_open_work_is_said_once_per_idle_stretch_and_grows_a_log():
    record = fresh()
    idle(record)
    assert nudges(record) == [], "nothing open: nothing said"
    works = Works(record, actor=AGENT)
    works.create("the header")
    idle(record)
    idle(record)
    assert nudges(record) == ["work 1 is still open, with nothing logged"] * 2, \
        "open work with an empty log is said at each idle, asking for the log"
    works.action("log")("Chose the header, because the footer waits on it")
    idle(record)
    assert nudges(record)[-1] == "work 1 is still open", "once logged, the open work is said with what to do about it"
    entry = works.load(1).sections[0]
    assert (entry["body"], entry["title"][:4], len(entry["title"])) == \
        ("Chose the header, because the footer waits on it", "1 · ", 20), \
        "a log entry is the message under its number and the time it was written"
    works.action("log")("Then the footer")
    assert len(works.load(1).sections) == 2, "each entry is its own section"


def test_edits_without_a_log_entry_hold_the_writes_until_the_work_is_logged():
    record = fresh()
    record.set_setting("work", {"log_after": 3, "said_after": 2})
    works = Works(record, actor=AGENT)
    works.create("editing")
    report(record, "working", "PostToolUse", wrote=True)
    report(record, "working", "PostToolUse", wrote=True)
    assert held(record, "claude-1") == "", "under the limit: nothing held"
    report(record, "working", "PostToolUse", wrote=False)
    assert held(record, "claude-1") == "", "a read is not an edit"
    report(record, "working", "PostToolUse", wrote=True)
    assert ("journal work log" in held(record, "claude-1")) is True, "at the limit the writes are held, naming the command"
    works.action("log")("Three edits in")
    assert held(record, "claude-1") == "", "a log entry releases the hold"
    assert [n for n in nudges(record) if "in hand" in n] == ["work 1 in hand — editing"], \
        "the work in hand is whispered as the edits go by"
    report(record, "working", "PostToolUse", wrote=True)
    assert held(record, "claude-1") == "", "and the count starts over"


def test_switched_off_and_parked_work_and_one_piece_of_work_in_hand():
    record = fresh()
    record.set_setting("features", {"work": False})
    todo = Todos(record, actor=USER).create("a row")
    work = Works(record, actor=AGENT).create("work", todo=todo.n)
    assert Works(record).load(work.n).refs == [], "work switched off: nothing is linked"
    assert refused(lambda: Works(record, actor=AGENT).action("log")(work.n, "x")) == "the work feature is off", \
        "its log command refuses while the feature is off"

    assert ("log" in COMMANDS["work"], hasattr(Works, "log")) == (True, False), \
        "work log is registered by the feature, not the controller"

    parking = Works(record, actor=AGENT)
    for open_row in [w for w in parking.all() if not w.completed]:
        parking.complete(open_row.n, "tidied for the next check")
    aside = parking.create("something that waits on the user")
    FEATURES["work"].park(parking, "the question is with the user", aside.n)
    assert (parking.load(aside.n).parked, bool(parking.load(aside.n).completed),
            [w.n for w in FEATURES["work"].working(record) if w.n == aside.n]) == \
        ("the question is with the user", False, []), "parked work says why, stays open, and is not work in hand"
    FEATURES["work"].resume(parking, aside.n)
    assert (parking.load(aside.n).parked, [w.n for w in FEATURES["work"].working(record) if w.n == aside.n]) == \
        ("", [aside.n]), "resume picks it up again"

    alone = Works(record, actor=AGENT)
    for w in alone.all():
        if not w.completed:
            alone.complete(w.n, "tidied for the next check")
    first = alone.create("the first thing")
    assert ("is open" in refused(lambda: alone.create("the second thing"))) is True, \
        "a second piece of work is refused while one is open"
    FEATURES["work"].log(alone, "a turn, with no number")
    assert [s["body"] for s in alone.load(first.n).sections] == ["a turn, with no number"], \
        "a log entry with no number lands on the work in hand"
    FEATURES["work"].park(alone, "waiting on the user")
    second = alone.create("the second thing")
    assert (alone.load(first.n).parked, alone.active().n) == ("waiting on the user", second.n), \
        "parked work lets the next one start"
    assert ("end it or park it" in refused(lambda: FEATURES["work"].resume(alone, first.n))) is True, \
        "picking up parked work is refused while another is in hand"
    alone.complete(second.n, "done")
    FEATURES["work"].resume(alone, first.n)
    assert (alone.load(first.n).parked, alone.active().n) == ("", first.n), "resume picks the parked one up"
    assert ("the one in hand" in refused(lambda: FEATURES["work"].log(alone, "x", second.n))) is True, \
        "a log entry aimed at work that is not in hand is refused"
