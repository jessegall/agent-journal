# Stays a test: it ages stored nudge rows between ticks and restarts the session mid-play, which a Given's steps cannot do
import time

from controllers.types import Agents, Nudges, Todos, Works
from features.nudges.standing import STANDING
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh
from tests.kit import idle, report, tick


def aged(record, minutes: float) -> None:
    state = record.state("nudges")
    state.set(STANDING, {n: {**s, "at": s["at"] - minutes * 60} for n, s in state.get(STANDING, {}).items()})


def numbered(record, title: str, completed: bool = False) -> list[int]:
    return [n.n for n in Nudges(record).all(completed=completed) if n.title == title]


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
