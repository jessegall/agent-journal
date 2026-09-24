import features
from controllers.types import CONTROLLERS
from resources.base import AGENT, USER
from tests.conftest import fresh, refused
from tests.kit import Nudges, nudges, report


def test_a_sequence_hands_its_steps_one_at_a_time_and_starts_on_its_moment():
    from features.sequences.shipped import SHIPPED, ship
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    assert (ship(record), ship(record)) == ([shipped["title"] for shipped in SHIPPED], []), "shipped once, never twice"
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    filing = next(r for r in sequences.summaries() if r["title"] == "Filing a dump")
    dump = CONTROLLERS["dump"](record, actor=USER).create("Standup", brief="notes")
    steps = lambda: [n for n in nudges(record) if n.startswith(f"sequence {filing['n']}")]
    assert steps() == [f"sequence {filing['n']}, Filing a dump, step 1 of 3 - Read everything"], "a dump starts the sequence about it"
    handed = next(n.brief for n in Nudges(record).all() if n.title.startswith(f"sequence {filing['n']}"))
    assert f"journal dump items {dump.n}" in handed and "<dump n>" not in handed, "the step names the dump it is about"
    sequences.next(filing["n"], about=dump.ref)
    assert steps()[-1] == f"sequence {filing['n']}, Filing a dump, step 2 of 3 - File by subject", "done hands the next step"
    sequences.next(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    assert sequences.load(filing["n"]).runs == {}, "the last step ends it"
    cards = CONTROLLERS["agent"](record).primary().data["cards"]
    marks = [(c["label"], c["color"]) for c in cards]
    assert [label for label, _ in marks] == ["Sequence started", "Sequence moved on", "Sequence moved on", "Sequence finished"] \
        and {c for _, c in marks} == {"#a78bfa"} and all(c["detail"].startswith("Filing a dump") for c in cards), \
        f"the chat shows a violet mark for a shipped sequence as it starts, moves on and finishes, its name under it: {marks}"
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


def test_a_sequence_starts_when_its_trigger_fires_and_an_unknown_start_is_refused():
    from engine.hooks import handle
    from providers import PROVIDERS
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    trigger = CONTROLLERS["trigger"](record, actor=USER).create("Deploys", words="deploy", words_in="commands", does="start")
    sequences = CONTROLLERS["sequence"](record, actor=USER)
    deploying = sequences.create("After a deploy", brief="check it")
    sequences.section(deploying.n, "Check the site", "open it")
    sequences.section(deploying.n, "Watch the logs", "tail them")
    assert "is no moment" in refused(lambda: sequences.set(deploying.n, "starts_on", "trigger.fired")), "an unknown start is refused in words"
    sequences.set(deploying.n, "starts_on", trigger.ref)
    call = {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": "make deploy"}, "hook_event_name": "PreToolUse"}
    handle(PROVIDERS["claude"](), record.root, record.env, call)
    assert f"sequence {deploying.n}, After a deploy, step 1 of 2 - Check the site" in nudges(record), "the trigger's words start the sequence"
    about = f"trigger:{trigger.n}"
    sequences.next(deploying.n, about=about)
    handle(PROVIDERS["claude"](), record.root, record.env, call)
    assert [run["step"] for run in sequences.load(deploying.n).runs.values()] == [2], "firing again while it runs never starts it over"
    assert "already running, at step 2" in refused(lambda: sequences.run(deploying.n, about=about)), "nor does starting it by hand"


def test_a_step_goes_to_the_agent_holding_the_environment_not_the_newest():
    import os
    from engine.sessions import Sessions
    from features.sequences.shipped import ship
    features.load()
    record = fresh()
    ship(record)
    Sessions(record.root).bind("holder", record.env, pid=os.getpid(), provider="claude")
    agents = CONTROLLERS["agent"](record)
    agents.by_session("holder")
    agents.by_session("newer")
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    filing = next(r for r in sequences.summaries() if r["title"] == "Filing a dump")
    CONTROLLERS["dump"](record, actor=USER).create("Standup", brief="notes")
    handed = [n.data.get("session") for n in CONTROLLERS["nudge"](record).all() if n.title.startswith(f"sequence {filing['n']}")]
    assert handed and set(handed) == {"holder"}, f"the step goes to the agent holding the environment, not the newest agent row: {handed}"


def test_a_step_is_called_late_only_once_it_has_waited_since_it_was_handed():
    import time
    from tests.kit import tick
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    made = sequences.create("Two steps")
    sequences.section(made.n, "First", "do the first")
    sequences.section(made.n, "Second", "do the second")
    sequences.run(made.n)
    key = next(iter(sequences.load(made.n).runs))
    sequences.update(made.n, runs={key: {"step": 1, "at": time.time() - 600}})
    late = lambda: [n for n in nudges(record) if "waited" in n]
    tick(record)
    assert len(late()) == 1, "a step handed ten minutes ago is called late"
    sequences.next(made.n)
    tick(record)
    assert len(late()) == 1, "the next step, handed just now, is not called late though the run began long ago"


def test_a_sequence_includes_the_steps_of_another_and_a_loop_is_refused():
    from features.sequences.shipped import ship
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    ship(record)
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    titled = lambda title: sequences.load(next(r["n"] for r in sequences.summaries() if r["title"] == title))
    closing = [s["title"] for s in sequences._steps(titled("Finishing what you wrote"))]
    assert [s["title"] for s in sequences._steps(titled("Writing a report"))] == ["Write the findings", *closing], \
        "a shipped sequence reuses the closing steps it shares"
    base = sequences.create("Base")
    for step in ("one", "two", "three"):
        sequences.section(base.n, step, f"do {step}")
    outer = sequences.create("Outer")
    sequences.section(outer.n, "start", "begin")
    sequences.include(outer.n, base.n, steps="2-3")
    assert [s["title"] for s in sequences._steps(sequences.load(outer.n))] == ["start", "two", "three"], "a range includes those steps"
    assert "never end" in refused(lambda: sequences.include(base.n, outer.n)), "including back would loop"
    sequences.run(outer.n)
    sequences.next(outer.n)
    sequences.next(outer.n)
    assert sequences.load(outer.n).runs, "the run counts the included steps"
    sequences.next(outer.n)
    assert not sequences.load(outer.n).runs, "and ends after the last of them"
