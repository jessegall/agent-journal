
from controllers.types import Nudges, Facts, Reminders
from features import load
from resources.base import AGENT, USER
from tests.kit import nudges, report
from tests.conftest import fresh


def test_standing_pins_are_repeated_at_the_first_quarter_and_superseding_or_promoting_strikes_the_old():
    record = fresh()
    pins = Facts(record, actor=AGENT)
    pins.create("the hook payload carries the parent's session id", keywords="word", brief="measured on 2026-09-01")
    pins.create("tests run bounded", keywords="word")
    report(record, "working", "PostToolUse", context=25)
    assert (nudges(record), Nudges(record).load(1).brief) == \
        (["2 facts standing, read them"], "1. the hook payload carries the parent's session id; 2. tests run bounded"), \
        "said at the first quarter"
    report(record, "working", "PostToolUse", context=40)
    assert len(nudges(record)) == 1, "not again inside the same quarter"

    newer = pins.create("the hook payload carries the parent session id; only agent_id tells it apart", keywords="word", supersedes=1)
    assert (pins.load(1).outcome, newer.refs) == ("superseded by fact 3", ["fact:1"]), \
        "superseded: the old is struck, saying by which, and the new links it"
    rule = pins.promote(2)
    assert (rule.type, rule.title, pins.load(2).outcome) == ("rule", "tests run bounded", "promoted to rule 1"), \
        "promoted: a rule with the pin's words, the pin struck"
    Reminders(record, actor=USER).create("run the suites first", until="the suites are green on CI")
    assert Reminders(record).load(1).data["until"] == "the suites are green on CI", "a reminder keeps its until"


def test_dismissing_a_fact_from_the_rail_is_not_told_to_the_agent_but_editing_it_is():
    from runner.engine import Engine
    from providers import DRIVERS
    load()
    record = fresh()
    report(record, "working", "PostToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    n = Facts(record, actor=AGENT).create("the server reloads itself", keywords="server").n
    engine.deliver()
    dismissal_fields, notify = [], engine.agent.notify
    engine.agent.notify = lambda event: (dismissal_fields.append(event.data.get("fields")), notify(event))
    user = Facts(record, actor=USER)
    user.set(n, "kept", "false")
    user.read(n)
    engine.deliver()
    assert dismissal_fields == [], f"a dismissal only shapes the user's own rail: {dismissal_fields}"
    user.update(n, brief="it re-execs on a .py change")
    engine.deliver()
    assert dismissal_fields == [["brief"]], f"a real edit by the user still reaches the agent: {dismissal_fields}"


