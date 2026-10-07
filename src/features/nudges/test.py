import time

from controllers.types import Agents, Messages, Nudges, Todos, Works
from features.nudges.standing import STANDING
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh
from tests.kit import idle, report, tick


def aged(record, minutes: float) -> None:
    state = record.state("nudges")
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
    idle(record)
    idle(record)
    tick(record)
    assert numbered(record, "todo 1 next", completed=True) == first, "more idle turns and a tick before the time is up say nothing again"
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


def test_a_line_about_named_rows_stands_until_every_one_of_them_is_answered():
    record = fresh()
    idle(record)
    nudges = Nudges(record, actor=SYSTEM)
    for title in ("the first asked about", "the second asked about", "an unrelated one"):
        Messages(record, actor=USER).create(title)
    asked = nudges.to_primary("answer message 1, message 2", asks="messages.answer", until=["message.completed"], rows=["message:1", "message:2"])
    Messages(record, actor=SYSTEM).complete(3)
    assert not nudges.load(asked.n).completed, "closing another message leaves it standing"
    Messages(record, actor=SYSTEM).complete(1)
    assert not nudges.load(asked.n).completed, "closing one of the two leaves it standing for the other"
    Works(record, actor=AGENT).create("something else")
    assert not nudges.load(asked.n).completed, "an event of a kind it does not wait for leaves it standing"
    Messages(record, actor=SYSTEM).complete(2)
    assert nudges.load(asked.n).completed, "closing the last one it names answers it"


def test_carry_on_is_said_once_by_work_tracking_and_again_only_by_the_repeat():
    record = fresh()
    works = Works(record, actor=AGENT)
    works.create("the release")
    agents = Agents(record, actor=SYSTEM)

    def idle_for(minutes):
        report(record, "idle", "Stop")
        row = agents.by_session("claude-1")
        agents.update(row.n, **{**row.data, "at": time.time() - minutes * 60})
        tick(record)
        return numbered(record, "you stopped with work 1, the release, in hand", completed=True)

    assert idle_for(4) == [], "four minutes after it stopped is not yet standing still"
    assert len(idle_for(6)) == 1, "five minutes after it stopped with work in hand it is told to carry on"
    assert (len(idle_for(16)), len(idle_for(26))) == (1, 1), "work tracking counts no rounds of its own, so nothing fires twice"
    aged(record, 6)
    assert len(idle_for(27)) == 2, "the repeat says it again once a period"
    works.action("await")("the CI run on main")
    aged(record, 6)
    assert len(idle_for(40)) == 2, "work it declared a wait on is left to the wait"
    assert numbered(record, "you stopped with work 1, the release, in hand") == [], "and the line is closed, its subject gone"


def test_a_repeat_ends_when_the_row_it_is_about_changes_or_waits():
    record = fresh()
    todos = Todos(record, actor=USER)
    todos.create("the schema")
    todos.create("the import")
    idle(record)
    tick(record)
    assert len(numbered(record, "todo 1 next")) == 1, "the top row is offered"
    Todos(record, actor=AGENT).block(1, "waits on the vendor")
    assert numbered(record, "todo 1 next") == [], "blocking the row ends the line about it"
    idle(record)
    tick(record)
    assert len(numbered(record, "todo 2 next")) == 1, "the next ready row is offered in its place"
    Todos(record, actor=AGENT).ask(2, "Files or SQLite?")
    aged(record, 60)
    tick(record)
    assert (numbered(record, "todo 2 next"), len(numbered(record, "todo 2 next", completed=True))) == ([], 1), \
        "a row that waits on a question is not asked about again, and its line is closed"


def test_lines_said_to_an_earlier_session_close_and_the_minutes_at_zero_stop_the_repeat():
    record = fresh()
    Todos(record, actor=USER).create("the schema")
    idle(record)
    tick(record)
    old, = numbered(record, "todo 1 next")
    report(record, "working", "PreToolUse", session="claude-2")
    aged(record, 60)
    tick(record, session="claude-2")
    assert Nudges(record).load(old).outcome == "said to a session that is no longer the agent's", \
        "after a restart the line said to the old session is closed, not said again"
    report(record, "idle", "Stop", session="claude-2")
    offered = numbered(record, "todo 1 next")
    assert [Nudges(record).load(n).session for n in offered] == ["claude-2"], "the new session is offered the row itself"
    record.set_setting("nudges", {"every": 0})
    aged(record, 60)
    tick(record, session="claude-2")
    assert numbered(record, "todo 1 next", completed=True) == [old, *offered], "with the minutes at 0 it is never said again"
