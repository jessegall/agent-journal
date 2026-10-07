from controllers.types import Messages, Nudges, Todos, Works
from features.repeat_until_done.handlers import STANDING
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh
from tests.kit import idle, tick


def aged(record, minutes: float) -> None:
    state = record.state("repeat_until_done")
    state.set(STANDING, {n: {**s, "at": s["at"] - minutes * 60} for n, s in state.get(STANDING, {}).items()})


def numbered(record, title: str, completed: bool = False) -> list[int]:
    return [n.n for n in Nudges(record).all(completed=completed) if n.title == title]


def test_an_offered_row_is_said_again_every_few_minutes_until_work_starts():
    record = fresh()
    Todos(record, actor=USER).create("the schema")
    idle(record)
    tick(record)
    first = numbered(record, "todo 1 next")
    assert len(first) == 1, "the ready row is offered once"
    tick(record)
    assert numbered(record, "todo 1 next", completed=True) == first, "a tick before the time is up says nothing again"
    aged(record, 6)
    tick(record)
    assert len(numbered(record, "todo 1 next", completed=True)) == 2 and numbered(record, "todo 1 next") != first, \
        "after five minutes it is said again, and the newer line takes the older one's place"
    assert Nudges(record).load(first[0]).outcome.startswith("replaced by nudge"), "the older line is closed, replaced by the newer"
    Todos(record, actor=AGENT).start(1)
    assert numbered(record, "todo 1 next") == [], "starting work answers it"
    aged(record, 60)
    tick(record)
    assert len(numbered(record, "todo 1 next", completed=True)) == 2, "and nothing is said again once it is answered"


def test_a_line_about_named_rows_is_answered_only_by_an_event_on_one_of_them():
    record = fresh()
    idle(record)
    nudges = Nudges(record, actor=SYSTEM)
    asked = nudges.to_primary("answer message 1", asks="messages.answer", until=["message.completed"], rows=["message:1"])
    Messages(record, actor=USER).create("the one asked about")
    Messages(record, actor=USER).create("an unrelated one")
    Messages(record, actor=SYSTEM).complete(2)
    assert not nudges.load(asked.n).completed, "closing another message leaves it standing"
    Messages(record, actor=SYSTEM).complete(1)
    assert nudges.load(asked.n).completed, "closing message 1 answers a line about message 1"
    other = nudges.to_primary("answer message 3", asks="messages.answer", until=["message.completed"], rows=["message:3"])
    Works(record, actor=AGENT).create("something else")
    assert not nudges.load(other.n).completed, "an event of a kind it does not wait for leaves it standing"
    record.set_setting("repeat_until_done", {"every": 0})
    aged(record, 60)
    tick(record)
    assert numbered(record, "answer message 3") == [other.n], "with the minutes set to nothing it is never said again"
