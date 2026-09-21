import pytest

import features
from controllers.types import Nudges, Facts, Reminders
from resources.base import AGENT, USER
from tests.kit import nudges, report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_standing_pins_are_repeated_at_the_first_tenth_and_superseding_or_promoting_strikes_the_old():
    record = fresh()
    pins = Facts(record, actor=AGENT)
    pins.create("the hook payload carries the parent's session id", brief="measured on 2026-09-01")
    pins.create("tests run bounded")
    report(record, "working", "PostToolUse", context=10)
    assert (nudges(record), Nudges(record).load(1).brief) == \
        (["2 facts standing, read them"], "1. the hook payload carries the parent's session id; 2. tests run bounded"), \
        "said at the first tenth"
    report(record, "working", "PostToolUse", context=14)
    assert len(nudges(record)) == 1, "not again inside the same tenth"

    newer = pins.create("the hook payload carries the parent session id; only agent_id tells it apart", supersedes=1)
    assert (pins.load(1).outcome, newer.refs) == ("superseded by fact 3", ["fact:1"]), \
        "superseded: the old is struck, saying by which, and the new links it"
    rule = pins.promote(2)
    assert (rule.type, rule.title, pins.load(2).outcome) == ("rule", "tests run bounded", "promoted to rule 1"), \
        "promoted: a rule with the pin's words, the pin struck"
    Reminders(record, actor=USER).create("run the suites first", until="the suites are green on CI")
    assert Reminders(record).load(1).data["until"] == "the suites are green on CI", "a reminder keeps its until"
