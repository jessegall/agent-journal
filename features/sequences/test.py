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
    assert (ship(record), ship(record)) == (["Filing a dump", "Building a plan"], []), "shipped once, never twice"
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
    first = CONTROLLERS["dump"](record, actor=USER).create("Planning", brief="notes")
    CONTROLLERS["dump"](record, actor=USER).create("Review", brief="notes")
    assert steps()[-1] == f"sequence {filing['n']}, Filing a dump, step 1 of 3 - Read everything" and len(steps()) == 4, \
        "a second run waits while the first is in hand"
    for _ in range(3):
        sequences.next(filing["n"], about=first.ref)
    assert len(steps()) == 7 and steps()[-1].endswith("step 1 of 3 - Read everything"), "when the first ends, the one that waited is handed its first step"
    report(record, "idle", "Stop")
    assert [n for n in nudges(record) if "is still at step" in n] == [f"sequence {filing['n']}, Filing a dump, is still at step 1 of 3 - carry on with it"], \
        "stopping with a run unfinished earns a reminder"
    review = next(key for key in sequences.load(filing["n"]).runs).split("|", 1)[1]
    sequences.abandon(filing["n"], about=review, why="the dump was a duplicate")
    assert (sequences.load(filing["n"]).runs, sequences.load(filing["n"]).data["abandoned"][-1]["why"]) == ({}, "the dump was a duplicate"), \
        "an abandoned run is dropped with its reason kept"
    other = CONTROLLERS["dump"](record, actor=USER).create("Retro", brief="notes")
    CONTROLLERS["dump"](record, actor=USER).delete(other.n, why="dropped by mistake")
    assert all(not key.endswith(f"dump:{other.n}") for key in sequences.load(filing["n"]).runs), "a run ends with the row it was about"
    assert refused(lambda: CONTROLLERS["sequence"](record, actor=USER).delete(filing["n"], why="tidy")) == \
        f"sequence {filing['n']} ships with the journal and cannot be changed or removed", "a system sequence stays"
    assert refused(lambda: CONTROLLERS["sequence"](record, actor=USER).update(filing["n"], title="Mine now")) == \
        f"sequence {filing['n']} ships with the journal and cannot be changed or removed", "and stays as it shipped"
    collection = CONTROLLERS["collection"](record, actor=USER).create("Keep")
    assert refused(lambda: CONTROLLERS["collection"](record, actor=USER).add(collection.n, [f"sequence:{filing['n']}"])) == \
        f"sequence:{filing['n']} ships with the journal and cannot be put in a collection", "nor collected"
