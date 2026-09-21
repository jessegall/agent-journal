import pytest

import features
from controllers.types import Nudges, Reminders
from engine.queries import start_block
from resources.base import AGENT, USER
from tests.kit import report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def nudges(record):
    return [(n.title, n.brief) for n in Nudges(record).all()]


def test_by_default_standing_reminders_are_said_at_every_tenth_of_context_not_on_idle():
    record = fresh()
    Reminders(record, actor=USER).create("run the suites first")
    report(record, "working", "PreToolUse")
    report(record, "idle", "Stop")
    assert nudges(record) == [], "the default is a context cadence, not the idle"
    report(record, "working", "PostToolUse", context=11)
    assert nudges(record) == [("1 reminder standing, read them", "1. run the suites first")], \
        "crossing a tenth says the standing reminders"


def test_on_worked_the_standing_reminders_are_said_once_per_idle_stretch_after_tool_use():
    record = fresh()
    record.set_setting("triggers", {"reminders": {"on": "worked"}})
    Reminders(record, actor=USER).create("run the suites first")
    Reminders(record, actor=USER).create("say which environment")
    report(record, "working", "PreToolUse")
    assert nudges(record) == [], "working: nothing is said"
    report(record, "idle", "Stop")
    assert nudges(record) == [("2 reminders standing, read them", "1. run the suites first; 2. say which environment")], \
        "idle: one nudge naming every standing reminder"
    report(record, "idle", "Stop")
    assert len(nudges(record)) == 1, "the same idle stretch: not said again"
    report(record, "working", "UserPromptSubmit")
    report(record, "idle", "Stop")
    assert len(nudges(record)) == 1, "a reply with no tool use between two stops: not said again"
    report(record, "working", "PreToolUse")
    report(record, "idle", "Stop")
    assert len(nudges(record)) == 2, "the next idle after work: said again"
    Reminders(record, actor=USER).complete(1, "done")
    report(record, "working", "PreToolUse")
    report(record, "idle", "Stop")
    assert nudges(record)[-1] == ("1 reminder standing, read them", "2. say which environment"), "a retired reminder is not repeated"


def test_nothing_standing_nothing_said():
    empty = fresh()
    report(empty, "idle", "Stop")
    assert nudges(empty) == [], "no reminders: no nudge"


def test_configured_by_unit_every_2_tool_uses():
    record = fresh()
    record.set_setting("triggers", {"reminders": {"every": 2, "unit": "uses"}})
    Reminders(record, actor=USER).create("keep going")
    for uses in (1, 2, 3, 4):
        report(record, "working", "PreToolUse", uses=uses)
    assert len(nudges(record)) == 2, "every 2 uses: said at 2 and at 4"
    report(record, "idle", "Stop", uses=4)
    assert len(nudges(record)) == 2, "idle no longer triggers it"


def test_every_10_percent_of_context_said_when_a_mark_is_crossed():
    record = fresh()
    record.set_setting("triggers", {"reminders": {"every": 10, "unit": "percent"}})
    Reminders(record, actor=USER).create("keep going")
    for pct in (3, 9.9, 10, 14, 19, 20.5, 41):
        report(record, "working", "PostToolUse", context=pct)
    assert len(nudges(record)) == 3, "10 percent marks: said at 10, 20 and 41"


def test_switched_off_silent():
    record = fresh()
    record.set_setting("features", {"reminders": False})
    Reminders(record, actor=USER).create("keep going")
    report(record, "idle", "Stop")
    assert nudges(record) == [], "feature off: nothing said"


def test_a_reminder_aimed_at_one_agent_is_said_only_to_that_session_and_stays_out_of_the_start_block():
    record = fresh()
    record.set_setting("triggers", {"reminders": {"on": "worked"}})
    Reminders(record, actor=USER).create("everyone hears this")
    Reminders(record, actor=AGENT).create("only claude-2 hears this", whom="claude-2")
    report(record, "working", "PreToolUse", session="claude-1")
    report(record, "idle", "Stop", session="claude-1")
    assert nudges(record)[-1] == ("1 reminder standing, read them", "1. everyone hears this"), \
        "a session hears only what is standing for everyone"
    report(record, "working", "PreToolUse", session="claude-2")
    report(record, "idle", "Stop", session="claude-2")
    assert nudges(record)[-1] == ("2 reminders standing, read them", "1. everyone hears this; 2. only claude-2 hears this"), \
        "the session it names hears both"
    assert ("only claude-2" in start_block(record)) is False, "what is aimed at one session is not in the start block"
    assert bool(Reminders(record).load(2).data.get("whom")) is True, "and an agent may write one, where it may not write a pin"
