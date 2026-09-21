import pytest

import features
from tests.kit import nudges, report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_no_journal_skill_loaded_in_a_window_is_told_once_privately_per_window():
    record = fresh()
    for i in range(26):
        report(record, "working", "PreToolUse", skills=[])
    assert [n for n in nudges(record) if "journal skill" in n] == ["no journal skill is loaded in this window"], \
        "twenty-five tool uses with no journal skill in the window: told once, privately"
    for i in range(26):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 1, "the unloaded window is not nurtured again"

    report(record, "compacting", "PreCompact", skills=[])
    for i in range(25):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 2, "a compaction opens one fresh window"

    for i in range(25):
        report(record, "working", "PreToolUse", skills=["journal"])
    for i in range(25):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 2, "loading later does not re-arm the same window"

    report(record, "idle", "SessionStart", skills=[])
    for i in range(25):
        report(record, "working", "PreToolUse", skills=[])
    assert len([n for n in nudges(record) if "journal skill" in n]) == 3, "a new session window permits one reminder"

    loaded = fresh()
    for i in range(30):
        report(loaded, "working", "PreToolUse", skills=["journal", "journal-todos"])
    assert nudges(loaded) == [], "with the skill loaded nothing is said"
    for i in range(30):
        report(loaded, "working", "PreToolUse", skills=[])
    assert nudges(loaded) == [], "an existing fired window upgrades without a fresh nudge"
