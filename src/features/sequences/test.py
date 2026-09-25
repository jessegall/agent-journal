import features
from controllers.types import CONTROLLERS, Agents
from resources.base import AGENT, SYSTEM, USER
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
    sequences.follow(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    assert steps()[-1] == f"sequence {filing['n']}, Filing a dump, step 2 of 3 - File by subject", "done hands the next step"
    sequences.follow(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    sequences.follow(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    assert sequences.load(filing["n"]).runs == {}, "the last step ends it"
    cards = CONTROLLERS["agent"](record).primary().data["cards"]
    marks = [(c["label"], c["color"]) for c in cards]
    assert [label for label, _ in marks] == ["Sequence started", "Sequence moved on", "Sequence moved on", "Sequence finished"] \
        and {c for _, c in marks} == {"#a78bfa"} and all(c["detail"].startswith("Filing a dump") for c in cards), \
        f"the chat shows a violet mark for a shipped sequence as it starts, moves on and finishes, its name under it: {marks}"
    first = CONTROLLERS["dump"](record, actor=USER).create("Planning", brief="notes")
    second = CONTROLLERS["dump"](record, actor=USER).create("Review", brief="notes")
    assert steps()[-1] == f"sequence {filing['n']}, Filing a dump, step 1 of 3 - Read everything" and len(steps()) == 5, \
        "a run started while another runs is handed at once, like a call"
    for _ in range(3):
        sequences.follow(filing["n"], about=second.ref)
        sequences.next(filing["n"], about=second.ref)
    assert len(steps()) == 8 and steps()[-1].endswith("step 1 of 3 - Read everything"), "when the inner run ends, the one it interrupted is handed its step again"
    report(record, "idle", "Stop")
    assert [n for n in nudges(record) if "is still at step" in n] == [f"sequence {filing['n']}, Filing a dump, is still at step 1 of 3 - carry on with it"], \
        "stopping with a run unfinished earns a reminder"
    review = next(key for key in sequences.load(filing["n"]).runs).split("|", 1)[1]
    assert "never taken up" in refused(lambda: sequences.abandon(filing["n"], about=review, why="the dump was a duplicate")), \
        "a step never taken up cannot be given up"
    sequences.follow(filing["n"], about=review)
    assert "skips Read everything; File by subject" in refused(lambda: sequences.abandon(filing["n"], about=review, why="the dump was a duplicate")), \
        "abandoning names the steps it would skip"
    sequences.abandon(filing["n"], about=review, why="the dump was a duplicate", sure=True)
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
    sequences.follow(deploying.n, about=about)
    sequences.next(deploying.n, about=about)
    handle(PROVIDERS["claude"](), record.root, record.env, call)
    assert [run["step"] for run in sequences.load(deploying.n).runs.values()] == [1], "firing again while it runs starts it over"
    assert CONTROLLERS["agent"](record).primary().data["cards"][-1]["label"] == "Sequence restarted", "and the chat says so"


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
    made = sequences.create("Two steps", talks_in="the dump window")
    sequences.section(made.n, "First", "do the first")
    sequences.section(made.n, "Second", "do the second")
    sequences.run(made.n)
    key = next(iter(sequences.load(made.n).runs))
    sequences.update(made.n, runs={key: {"step": 1, "at": time.time() - 600}})
    late = lambda: [n for n in nudges(record) if "how is it going" in n]
    tick(record)
    assert len(late()) == 1, "a step handed ten minutes ago is called late"
    sequences.follow(made.n)
    sequences.next(made.n)
    tick(record)
    assert len(late()) == 1, "the next step, handed just now, is not called late though the run began long ago"
    from engine import chat
    sent = []
    import engine.bus
    real = engine.bus.emit
    engine.bus.emit = lambda event, record=None: (sent.append(event.data.get("text")) if event.action == "message.sent" else None, real(event, record))[1]
    try:
        chat.send(record, Agents(record, actor="system").by_session("claude-1"), "Filed the second item.")
    finally:
        engine.bus.emit = real
    assert (sent, [n for n in nudges(record) if "kept out of the chat" in n][:1]) == ([], ["what you wrote during Two steps was kept out of the chat"]), \
        "while a sequence that talks in a window runs, the agent's words stay out of the main chat, and it is told so once"


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
    sequences.follow(outer.n)
    sequences.next(outer.n)
    sequences.follow(outer.n)
    sequences.next(outer.n)
    assert sequences.load(outer.n).runs, "the run counts the included steps"
    sequences.follow(outer.n)
    sequences.next(outer.n)
    assert not sequences.load(outer.n).runs, "and ends after the last of them"


def test_a_handed_step_holds_writes_until_the_agent_takes_it_up():
    from features.base import held
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    session = Agents(record, actor="system").by_session("claude-1").title
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    made = sequences.create("Two steps")
    sequences.section(made.n, "First", "do the first")
    sequences.section(made.n, "Second", "do the second")
    sequences.run(made.n)
    assert "handed you step 1" in held(record, session), "a handed step holds the agent's writes until it answers it"
    sequences.follow(made.n)
    assert "handed you step" not in held(record, session), "taking the step up releases them, so the step's own work can be done"
    sequences.follow(made.n)
    sequences.next(made.n)
    assert "handed you step 2" in held(record, session), "each next step is taken up the same way, so none is skipped unseen"
    CONTROLLERS["sequence"](record, actor=SYSTEM).abandon(made.n, why="it no longer applies")
    assert "handed you step" not in held(record, session), "an abandoned run holds nothing"


def test_a_step_reaches_an_agent_whose_work_waits_on_something():
    from controllers.types import Works
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    works = Works(record, actor=AGENT)
    works.create("Ship it")
    works.action("await")("the CI run on main")
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    made = sequences.create("Writing an update")
    sequences.section(made.n, "Gather", "list what changed")
    sequences.run(made.n)
    assert f"sequence {made.n}, Writing an update, step 1 of 1 - Gather" in nudges(record), \
        "a step handed while the agent's work waits on something still reaches it"


def test_a_step_not_taken_up_holds_journal_commands_but_not_the_ones_that_answer_it():
    from engine.hooks import handle
    from providers import PROVIDERS
    features.load()
    record, claude = fresh(), PROVIDERS["claude"]()
    report(record, "working", "PreToolUse")
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    made = sequences.create("Two steps")
    sequences.section(made.n, "First", "do the first")
    sequences.section(made.n, "Second", "do the second")
    sequences.run(made.n)
    call = lambda command: {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command}, "hook_event_name": "PreToolUse"}
    refused = lambda command: str(handle(claude, record.root, record.env, call(command)).get("reason") or "")
    assert "take it up with journal sequence follow" in refused("journal todo create 'other work'"), "a journal write waits for the step"
    assert "take it up" in refused(f"journal sequence follow {made.n}\n  journal todo create 'other work'"), \
        "a write on a later line of the same command waits too, whatever else the command does"
    assert "take it up" not in refused(f"journal sequence follow {made.n}") and "take it up" not in refused("journal message reply 3 'on it'"), \
        "taking the step up and answering the user are never held"
    sequences.follow(made.n)
    assert "take it up" not in refused("journal todo create 'other work'"), "once taken up, journal commands go through"


def test_a_standing_step_is_nudged_until_a_question_about_its_own_run_is_asked():
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
    late = lambda: [n for n in nudges(record) if "how is it going" in n]
    CONTROLLERS["question"](record, actor=AGENT).create("Which colour for the button?")
    sequences.update(made.n, runs={key: {"step": 1, "at": time.time() - 90}})
    tick(record)
    assert len(late()) == 1, "a step standing still for a minute is nudged, whatever unrelated question is open"
    CONTROLLERS["question"](record, actor=AGENT).create("Is this step still wanted?", about=made.ref)
    sequences.update(made.n, runs={key: {"step": 1, "at": time.time() - 300}})
    tick(record)
    assert len(late()) == 1, "a question about the run itself pauses its nudge"


def test_only_a_starting_trigger_starts_a_sequence_and_each_message_gets_its_own_run():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    triggers = CONTROLLERS["trigger"](record, actor=USER)
    nudging = triggers.create("Deploy talk", words="deploy", does="nudge", text="careful")
    starting = triggers.create("TLDR", words="tldr", words_in="user", does="start")
    sequences = CONTROLLERS["sequence"](record, actor=USER)
    update = sequences.create("Writing an update")
    sequences.section(update.n, "Gather", "list what changed")
    sequences.section(update.n, "Write", "write it")
    assert "starts nothing" in refused(lambda: sequences.set(update.n, "starts_on", nudging.ref)), "a trigger that does not start cannot start one"
    sequences.set(update.n, "starts_on", starting.ref)
    messages = CONTROLLERS["message"](record, actor=USER)
    first, second = messages.create("give me the tldr"), messages.create("tldr again please")
    runs = sequences.load(update.n).runs
    assert sorted(key.split("|", 1)[1] for key in runs) == [first.ref, second.ref], "each message that fires the trigger gets a run of its own"
    assert sequences._in_hand()[1].endswith(second.ref), "the newest run is the one in hand"
    CONTROLLERS["sequence"](record, actor=SYSTEM).abandon(update.n, about=second.ref, why="asked twice")
    assert sequences._in_hand()[1].endswith(first.ref) and "followed" not in sequences._in_hand()[2], \
        "when the inner run ends, the one it interrupted is handed again, to be taken up anew"
