# Stays a test: it plays a cadence by percent, uses, minutes and notices through the trigger engine, which an expectation cannot state.

from controllers.types import Reminders
from features.session_briefing.start import start_block
from resources.base import AGENT, USER
from tests.kit import nudges_with_briefs as nudges, report
from tests.conftest import fresh


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


def test_a_cadence_is_due_by_percent_uses_minutes_idle_worked_start_or_notices_and_never_without_one():
    from types import SimpleNamespace
    from engine import triggering
    from declaring.trigger import MINUTES, NOTICES, PERCENT, START, USES, WORKED, Trigger
    from engine.triggering import due, fired
    record = fresh()
    agent = SimpleNamespace(title="claude-1", context=30.0, uses=5, status="idle", event="Stop")
    named = lambda unit, **given: due(record, agent, f"cadence-{unit}", Trigger(unit=unit, **given))
    assert (due(record, agent, "none", Trigger()), named("nothing", every=1)) == (False, False), "a cadence with no unit, or one nobody knows, is never due"
    assert (named(PERCENT, every=25), named(PERCENT, at=(10.0, 50.0)), named(PERCENT, at=(50.0,))) == (True, True, False), "context is due when it crosses a step or a mark"
    assert (named(USES, every=5), named(USES, every=6)) == (True, False), "tool uses are due once enough have passed"
    assert (named(WORKED, every=1), named(START, every=1)) == (True, False), "an idle stretch after work is due, and a start only on a session start"
    agent.event = "SessionStart"
    assert named(START, every=1), "a session start makes the start cadence due"
    fired(record, agent, "cadence-minutes")
    assert (named(MINUTES, every=1), named(NOTICES, every=1)) == (False, False), "a cadence that just fired waits its minutes, and notices wait for something noticed"
    triggering.noticed(record, agent, "cadence-notices")
    assert named(NOTICES, every=1), "a noticed event makes the notices cadence due"
