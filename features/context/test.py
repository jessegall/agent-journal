import pytest

import features
from controllers.types import Agents, Facts, Rules, Works
from features.base import held
from resources.base import AGENT, SYSTEM
from tests.kit import nudges as all_nudges, report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


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
    Facts(record, actor=AGENT).create("what a later reader needs")
    assert gate() == "", "a fact decides it: released"
    report(record, "working", "PostToolUse", context=71)
    assert len(nudges(record)) == 2, "70 crossed: asked again"
    Rules(record, actor=AGENT).create("what binds everywhere")
    assert gate() == "", "a rule decides it"
    report(record, "working", "PostToolUse", context=91)
    assert bool(gate()) is True, "90 crossed"
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session("claude-1")
    agents.update(row.n, **{**row.data, "decided": "nothing here worth pinning"})
    assert gate() == "", "journal nothing decides it too"
    record.set_setting("triggers", {"context": {"at": [96], "unit": "percent"}})
    report(record, "working", "PostToolUse", context=95)
    assert bool(gate()) is False, "the marks are a setting"
