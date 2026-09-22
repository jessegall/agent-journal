import features
from controllers.types import CONTROLLERS
from resources.base import AGENT, USER
from tests.conftest import fresh, refused
from tests.kit import nudges, report


def test_a_sequence_hands_its_steps_one_at_a_time_and_starts_on_its_moment():
    from features.sequences.shipped import ship
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    assert (ship(record), ship(record)) == (["Filing a dump"], []), "shipped once, never twice"
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    filing = next(r for r in sequences.summaries() if r["title"] == "Filing a dump")
    dump = CONTROLLERS["dump"](record, actor=USER).create("Standup", brief="notes")
    steps = lambda: [n for n in nudges(record) if n.startswith(f"sequence {filing['n']}")]
    assert steps() == [f"sequence {filing['n']}, Filing a dump, step 1 of 3 - Read everything"], "a dump starts the sequence about it"
    sequences.next(filing["n"], about=dump.ref)
    assert steps()[-1] == f"sequence {filing['n']}, Filing a dump, step 2 of 3 - File every item", "done hands the next step"
    sequences.next(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    assert sequences.load(filing["n"]).runs == {}, "the last step ends it"
    other = CONTROLLERS["dump"](record, actor=USER).create("Retro", brief="notes")
    CONTROLLERS["dump"](record, actor=USER).delete(other.n, why="dropped by mistake")
    assert sequences.load(filing["n"]).runs == {}, "a run ends with the row it was about"
    assert refused(lambda: CONTROLLERS["sequence"](record, actor=USER).delete(filing["n"], why="tidy")) == \
        f"sequence {filing['n']} ships with the journal and cannot be removed", "a system sequence stays"
