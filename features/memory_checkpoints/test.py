
from commands.queries import decided
from controllers.types import Agents, Facts, Rules, Works
from features.base import held
from resources.base import AGENT, SYSTEM
from tests.kit import nudges as all_nudges, report
from tests.conftest import fresh


def nudges(record):
    return [n for n in all_nudges(record) if n.startswith("context")]


def test_a_context_mark_holds_writes_until_the_agent_pins_rules_or_says_nothing():
    record = fresh()

    def gate():
        return held(record, "claude-1")

    Works(record, actor=AGENT).create("something open")
    report(record, "working", "PostToolUse", context=30)
    assert (gate(), nudges(record)) == ("", []), "under the first mark: no hold, nothing said"
    report(record, "working", "PostToolUse", context=52)
    assert (gate(), nudges(record)) == \
        ('context 52% full — decide before any other write — journal fact, journal rule, or journal nothing "<why>"', ["context 52% full, decide"]), \
        "50 crossed: a hold on writes and a nudge to decide"
    report(record, "working", "PostToolUse", context=60)
    assert (bool(gate()), len(nudges(record))) == (True, 1), "between marks: the hold stands, nothing new said"
    Facts(record, actor=AGENT).create("what a later reader needs", keywords="word")
    assert gate() == "", "a fact decides it: released"
    report(record, "working", "PostToolUse", context=71)
    assert len(nudges(record)) == 2, "70 crossed: asked again"
    Rules(record, actor=AGENT).create("what binds everywhere", keywords="word")
    assert gate() == "", "a rule decides it"
    report(record, "working", "PostToolUse", context=91)
    assert bool(gate()) is True, "90 crossed"
    Agents(record, actor=SYSTEM).by_session("claude-99")
    decided({"record": record, "session": "claude-99", "why": "nothing here worth pinning"})
    assert gate() == "", "journal nothing from the agent's own shell decides it, even when the shell names the launcher's seat and not the session the hooks report on"
    record.set_setting("triggers", {"context": {"at": [96], "unit": "percent"}})
    report(record, "working", "PostToolUse", context=95)
    assert bool(gate()) is False, "the marks are a setting"


def test_every_standing_rule_and_fact_is_read_again_a_week_on():
    from features.memory_checkpoints.reread import owed, standing
    record = fresh()
    Facts(record, actor=AGENT).create("the port is 8423", brief="seen in the heartbeat", keywords=["port"])
    struck = Facts(record, actor=AGENT).create("the port is 8430", brief="an old port", keywords=["port"])
    Facts(record, actor=AGENT).complete(struck.n, "moved")
    Rules(record, actor=AGENT).create("main only", brief="the user said so", keywords=["branch"])
    assert owed(record) is False, "a young record owes no reading pass yet"
    assert owed(record, days=0) is True, "a week after its first event, never read: owed"
    assert sorted(r.ref for r in standing(record)) == ["fact:1", "rule:1"], "the reading pass is every standing rule and fact"
    Rules(record, actor=AGENT).action("reread")()
    assert owed(record) is False, "read: no longer owed"
