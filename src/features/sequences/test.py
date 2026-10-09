import features
from controllers.types import CONTROLLERS, Agents
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused
from tests.kit import Nudges, nudges, report


def test_a_sequence_hands_its_steps_one_at_a_time_and_starts_on_its_moment():
    from features.sequences.shipped import ship, shipped_sequences
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    assert (ship(record), ship(record)) == ([shipped.title for shipped in shipped_sequences()], []), "shipped once, never twice"
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    filing = next(r for r in sequences.rows.summaries() if r["title"] == "Sort dumped files")
    dump = CONTROLLERS["dump"](record, actor=USER).create("Standup", brief="notes")
    steps = lambda: [n for n in nudges(record) if n.startswith(f"sequence {filing['n']}")]
    assert steps() == [f"sequence {filing['n']}, Sort dumped files, step 1 of 3 - Read each file"], "a dump starts the sequence about it"
    handed = next(n.brief for n in Nudges(record).all() if n.title.startswith(f"sequence {filing['n']}"))
    assert f"journal dump items {dump.n}" in handed and "<dump n>" not in handed, "the step names the dump it is about"
    sequences.follow(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    assert steps()[-1] == f"sequence {filing['n']}, Sort dumped files, step 2 of 3 - File each subject", "done hands the next step"
    sequences.follow(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    sequences.follow(filing["n"], about=dump.ref)
    sequences.next(filing["n"], about=dump.ref)
    assert sequences.load(filing["n"]).runs == {}, "the last step ends it"
    cards = CONTROLLERS["agent"](record).primary().data["cards"]
    marks = [(c["label"], c["color"]) for c in cards]
    assert [label for label, _ in marks] == ["Sequence started", "Sequence moved on", "Sequence moved on", "Sequence finished"] \
        and {c for _, c in marks} == {"#a78bfa"} and all(c["detail"].startswith("Sort dumped files") for c in cards), \
        f"the chat shows a violet mark for a shipped sequence as it starts, moves on and finishes, its name under it: {marks}"
    first = CONTROLLERS["dump"](record, actor=USER).create("Planning", brief="notes")
    second = CONTROLLERS["dump"](record, actor=USER).create("Review", brief="notes")
    assert steps()[-1] == f"sequence {filing['n']}, Sort dumped files, step 1 of 3 - Read each file" and len(steps()) == 5, \
        "a run started while another runs is handed at once, like a call"
    for _ in range(3):
        sequences.follow(filing["n"], about=second.ref)
        sequences.next(filing["n"], about=second.ref)
    assert len(steps()) == 8 and steps()[-1].endswith("step 1 of 3 - Read each file"), "when the inner run ends, the one it interrupted is handed its step again"
    report(record, "idle", "Stop")
    assert [n for n in nudges(record) if "is still at step" in n] == [f"sequence {filing['n']}, Sort dumped files, is still at step 1 of 3 - carry on with it"], \
        "stopping with a run unfinished earns a reminder"
    review = next(key for key in sequences.load(filing["n"]).runs).split("|", 1)[1]
    assert "never taken up" in refused(lambda: sequences.abandon(filing["n"], about=review, why="the dump was a duplicate")), \
        "a step never taken up cannot be given up"
    sequences.follow(filing["n"], about=review)
    assert "skips Read each file; File each subject" in refused(lambda: sequences.abandon(filing["n"], about=review, why="the dump was a duplicate")), \
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
    from features.sequences.shipped import retire
    from resources.base import SYSTEM
    retire(CONTROLLERS["sequence"](record, actor=SYSTEM), {shipped.title for shipped in shipped_sequences()} - {"Sort dumped files"})
    assert sequences.load(filing["n"]).deleted, "a sequence the journal no longer ships is taken away on upgrade, and the ones it still ships stay"


def test_a_sequence_starts_when_its_trigger_fires_and_an_unknown_start_is_refused():
    from runner.hooks import handle
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
    agent = CONTROLLERS["sequence"](record, actor=AGENT)
    sequences.section(deploying.n, "Note it", "journal todo create \"Deployed\"")
    agent.follow(deploying.n, about=about)
    agent.next(deploying.n, about=about, through=2)
    assert [run["step"] for run in sequences.load(deploying.n).runs.values()] == [3], "next --through moves past the steps done together"
    tool = {**call, "tool_input": {"command": 'journal todo create "Deployed"'}}
    assert "reason" not in str(handle(PROVIDERS["claude"](), record.root, record.env, tool)), "running the command a step names takes it up"
    assert [run.get("followed") for run in sequences.load(deploying.n).runs.values()] == [3], "and marks it followed"


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
    filing = next(r for r in sequences.rows.summaries() if r["title"] == "Sort dumped files")
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
    late = lambda: [n for n in nudges(record) if "is still at step" in n]
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
    titled = lambda title: sequences.load(next(r["n"] for r in sequences.rows.summaries() if r["title"] == title))
    closing = [s["title"] for s in sequences.steps_of(titled("Filing and sharing a document or report"))]
    assert [s["title"] for s in sequences.steps_of(titled("Writing a report"))] == ["Add the report’s section headings", "Write the report’s sections", *closing], \
        "a shipped sequence reuses the closing steps it shares"
    written = record.root / "written.md"
    written.write_text("# Routes\nHow routes are planned.\n\n## Stops\nEvery stop has a window.\n\n## Drivers\nOne van each.\n")
    filed = CONTROLLERS["doc"](record, actor=AGENT).file("Route planning", str(written))
    assert (filed.brief, [s["title"] for s in filed.sections]) == ("How routes are planned.", ["Stops", "Drivers"]), "a written text is filed whole, a chapter per heading"
    about = sequences._key(f"doc:{filed.n}")
    assert about in titled("Filing a document that is already written").runs and about not in titled("Writing a document").runs, \
        "a document filed whole goes straight to the closing steps"
    sequences.follow(titled("Filing a document that is already written").n, f"doc:{filed.n}")
    sequences.abandon(titled("Filing a document that is already written").n, f"doc:{filed.n}", "checked", sure=True)
    plain = sequences._key(f"doc:{CONTROLLERS['doc'](record, actor=AGENT).create('Depot hours').n}")
    assert plain in titled("Writing a document").runs and plain not in titled("Filing a document that is already written").runs, "a document begun empty is written chapter by chapter"
    base = sequences.create("Base")
    for step in ("one", "two", "three"):
        sequences.section(base.n, step, f"do {step}")
    outer = sequences.create("Outer")
    sequences.section(outer.n, "start", "begin")
    sequences.include(outer.n, base.n, steps="2-3")
    assert [s["title"] for s in sequences.steps_of(sequences.load(outer.n))] == ["start", "two", "three"], "a range includes those steps"
    assert "never end" in refused(lambda: sequences.include(base.n, outer.n)), "including back would loop"
    sequences.run(outer.n)
    sequences.follow(outer.n)
    moved = sequences.next(outer.n)
    assert moved == f"Step 2 of 3 of sequence {outer.n} is next, two: take it up with journal sequence follow {outer.n}." and f"sequence:{base.n}" not in moved, \
        "next names the step that follows in the sequence being run, never the included sequence's marker an agent would mistake for another sequence to run"
    sequences.follow(outer.n)
    sequences.next(outer.n)
    assert sequences.load(outer.n).runs, "the run counts the included steps"
    sequences.follow(outer.n)
    assert sequences.next(outer.n) == f"Sequence {outer.n} is finished." and not sequences.load(outer.n).runs, "and ends after the last of them"
    assert "steps is one step or a range" in refused(lambda: sequences.include(outer.n, base.n, steps="two")), "a range of steps is numbers"
    sequences.steps(outer.n, '[{"title": "first", "body": "do it"}, {"title": "second"}]')
    assert [(step["title"], step["body"]) for step in sequences.steps_of(sequences.load(outer.n))] == [("first", "do it"), ("second", "")], "steps are replaced whole from a list"
    assert [("JSON list" in refused(lambda: sequences.steps(outer.n, text))) for text in ("{broken", '[{"body": "no title"}]', '"one"')] == [True] * 3, \
        "steps must be a list whose every step has a title"
    assert "share a title" in refused(lambda: sequences.steps(outer.n, '[{"title": "x"}, {"title": "x"}]')), "two steps never share a title"
    empty = sequences.create("Empty")
    assert "has no steps" in refused(lambda: sequences.run(empty.n)), "a sequence without steps cannot run"
    sequences.run(outer.n)
    assert "never taken up" in refused(lambda: sequences.next(outer.n)), "an agent takes a step up before it moves on"
    sequences.follow(outer.n)
    assert "names a step from" in refused(lambda: sequences.next(outer.n, through=9)), "the steps to skip over are steps still ahead"
    assert "say why" in refused(lambda: sequences.abandon(outer.n, why=" ")), "abandoning a run says why"
    assert "is not running about doc:3" in refused(lambda: sequences.next(outer.n, about="doc:3")), "a sequence that is not running about a row says which row"
    assert sequences.finish(outer.n, "doc:3").n == outer.n, "finishing a run that is not there changes nothing"


def test_a_handed_step_holds_writes_until_the_agent_takes_it_up():
    from engine.gates import held
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
    from features.recital import mentioned
    from features.sequences.shipped import WRITING_AN_UPDATE
    assert [mentioned(WRITING_AN_UPDATE.words, text) for text in ("Can you catch me up?", "Kun je me even bijpraten?", "Geef me een update", "Ga door")] == \
        [True, True, True, False], "asking for an update starts it in Dutch as well as English"
    made = sequences.create("Writing an update")
    sequences.section(made.n, "Gather", "list what changed")
    sequences.run(made.n)
    assert f"sequence {made.n}, Writing an update, step 1 of 1 - Gather" in nudges(record), \
        "a step handed while the agent's work waits on something still reaches it"


def test_a_step_not_taken_up_holds_journal_commands_but_not_the_ones_that_answer_it():
    from runner.hooks import handle
    from providers import PROVIDERS
    features.load()
    record, claude = fresh(), PROVIDERS["claude"]()
    report(record, "working", "PreToolUse")
    sequences = CONTROLLERS["sequence"](record, actor=AGENT)
    made = sequences.create("Two steps")
    sequences.section(made.n, "First", "do the first")
    sequences.section(made.n, "Second", "do the second")
    sequences.run(made.n)
    uses = iter(range(100))
    call = lambda command, use: {"session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command}, "hook_event_name": "PreToolUse", "tool_use_id": use}
    refused = lambda command, use=None: str(handle(claude, record.root, record.env, call(command, use or f"use-{next(uses)}")).get("reason", ""))
    assert "take it up with journal sequence follow" in refused("journal work start 'other work'"), "a journal write waits for the step"
    assert "take it up" in refused(f"journal sequence follow {made.n}\n  journal work start 'other work'"), \
        "a write on a later line of the same command waits too, whatever else the command does"
    assert "take it up" not in refused(f"journal sequence follow {made.n}; journal plan progress 3; journal todo all"), \
        "reading the journal is never held, so the step can be taken up alongside a read"
    assert not any("take it up" in refused(line) for line in (f"journal sequence follow {made.n}", "journal message reply 3 'on it'", "journal todo create 'other work'")), \
        "taking the step up, answering the user and filing a to-do are never held"
    assert all("take it up" in refused(line) for line in ("journal message reply 3 a#; journal work start 'other work'", "journal --env other todo create other",
                                                          "journal todo create other --session other", "journal --en other todo create other",
                                                          "journal --ro /tmp/other todo create other", "journal --plugin x todo create other")), \
        "a '#' inside a word hides nothing, and a line naming its own environment, root, session or plugin, even abbreviated, is held"
    assert "ran" not in refused("/tmp/journal message reply 3 x; journal work start 'other work'"), "only the bare journal command runs, never another program by that name"
    mixed = lambda: refused("journal todo create filed; journal work start 'other work'", "use-mixed")
    first, again = mixed(), mixed()
    assert "take it up" in first and "ran, so do not run them again: journal todo create filed" in first and "did not run either: journal work start 'other work'" in first, first
    assert [row.title for row in CONTROLLERS["todo"](record, actor=AGENT).all()].count("filed") == 1 and "do not run them again" in again, \
        "the filing command of a refused line runs once, however often the same tool call's hook arrives"
    failing = lambda: refused("journal message reply 99999 'on it'; journal work start 'other work'", "use-failing")
    first, again = failing(), failing()
    assert "do not run them again: journal message reply 99999" not in first + again and "did not run either" in first + again, \
        "a command of a refused line that failed is never listed as run, and a second try does not say it ran"
    sequences.follow(made.n)
    assert "take it up" not in refused("journal work start 'other work'"), "once taken up, journal commands go through"


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
    late = lambda: [n for n in nudges(record) if "is still at step" in n]
    CONTROLLERS["question"](record, actor=AGENT).create("Which colour for the button?", options=[{"title": "Blue"}, {"title": "Red"}], pick=1)
    sequences.update(made.n, runs={key: {"step": 1, "at": time.time() - 90}})
    tick(record)
    assert len(late()) == 1, "a step standing still for a minute is nudged, whatever unrelated question is open"
    about_run = CONTROLLERS["question"](record, actor=AGENT).create("Is this step still wanted?", about=made.ref, options=[{"title": "Yes, still wanted"}, {"title": "No, drop it"}], pick=1)
    sequences.update(made.n, runs={key: {"step": 1, "at": time.time() - 300}})
    tick(record)
    assert len(late()) == 1, "a question about the run itself pauses its nudge"
    from controllers.types import Works
    CONTROLLERS["question"](record, actor=USER).complete(about_run.n, how="yes")
    Works(record, actor=AGENT).create("Delegated")
    Works(record, actor=AGENT).action("await")("the auditor's test run")
    sequences.update(made.n, runs={key: {"step": 1, "at": time.time() - 120}})
    tick(record)
    assert len(late()) == 1, "while the agent's work awaits something, a step is nudged at the await's pace, not every minute"


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
    assert sequences.in_hand()[1].endswith(second.ref), "the newest run is the one in hand"
    CONTROLLERS["sequence"](record, actor=SYSTEM).abandon(update.n, about=second.ref, why="asked twice")
    assert sequences.in_hand()[1].endswith(first.ref) and "followed" not in sequences.in_hand()[2], \
        "when the inner run ends, the one it interrupted is handed again, to be taken up anew"

    todos = CONTROLLERS["todo"]
    watching = sequences.create("Watching todos", starts_on="todo.created", started_by="user", unless={"assigned": "bot"})
    sequences.section(watching.n, "Look at <ref>", "journal todo show <todo n> then <ref n> as <type>, <this sequence>")
    started = lambda: sorted(sequences.load(watching.n).runs)
    todos(record, actor=AGENT).create("by the agent")
    assert started() == [], "a sequence for what the user made does not start on a row the agent made"
    todos(record, actor=USER).create("assigned to a bot", assigned="bot")
    assert started() == [], "a row matching its unless is left alone"
    own = todos(record, actor=USER).create("by the user")
    assert [key.split("|", 1)[1] for key in started()] == [own.ref], "a row of the user's that matches no unless starts it, about that row"
    step = next(n.brief for n in Nudges(record).all() if n.title.startswith(f"sequence {watching.n}"))
    assert f"journal todo show {own.n} then {own.n} as todo, {watching.n}" in step, "the step fills in the row it is about"
    todos(record, actor=SYSTEM).delete(own.n)
    assert started() == [], "a run ends with the row it is about"

    CONTROLLERS["sequence"](record, actor=SYSTEM).abandon(update.n, about=first.ref, why="done")
    idle = sequences.create("Only when idle", starts_on="todo.created", only_when_idle=True)
    sequences.section(idle.n, "Idle step", "do it")
    busy = sequences.create("Busy", brief="in hand")
    sequences.section(busy.n, "Hold", "hold")
    sequences.run(busy.n)
    todos(record, actor=AGENT).create("while busy")
    assert sequences.load(idle.n).runs == {}, "a sequence that starts only when idle waits while another is in hand"
    CONTROLLERS["sequence"](record, actor=SYSTEM).abandon(busy.n, why="done")
    todos(record, actor=AGENT).create("when idle")
    assert len(sequences.load(idle.n).runs) == 1, "and starts once nothing is in hand"

    from engine.sessions import Sessions
    dispatching = sequences.create("Dispatching", dispatch="filler")
    sequences.section(dispatching.n, "Fill <board n>", "fill it")
    sequences.section(dispatching.n, "Check <board n>", "check it")
    sequences.run(dispatching.n, about="board:3")
    assert ("board 3 waits for the filler (a new request) - dispatch it now" in nudges(record), Sessions(record.root).granted("claude-1", record.env)) == (True, True), \
        "a sequence that dispatches tells the working agent to dispatch, about the board, and lends it the environment"
    handed = CONTROLLERS["sequence"](record, actor=AGENT, agent="filler").next(dispatching.n, about="board:3")
    assert "check it" in str(handed), "the agent the sequence dispatched moves it on and is handed the next step at once"
    asked = CONTROLLERS["question"](record, actor=AGENT).create("Which one?", about="board:3", options=[{"title": "A"}, {"title": "B"}], pick=1)
    CONTROLLERS["question"](record, actor=USER).complete(asked.n, how="the first")
    assert f"board 3 waits for the filler (question {asked.n} answered - the first) - dispatch it now" in nudges(record), "an answer to a question about the board dispatches it again"
    from migrations.m0063_one_sequence_step_reminder import run as move_reminder
    moved = fresh()
    moved.set_setting("sequences", {"nudge_every": "5", "keep": 1})
    assert move_reminder(moved.root)[0].startswith("t: the sequence step reminder runs every 5 minutes"), "an old reminder setting is moved"
    assert moved.setting("triggers") == {"sequences.unfinished": {"unit": "minutes", "every": 5}}, "it becomes the sequence trigger's cadence"
    assert moved.setting("sequences") == {"keep": 1}, "the old key is gone and the rest stays"
    assert move_reminder(moved.root) == [], "once moved it is not moved again"
    moved.set_setting("sequences", {"nudge_every": "soon"})
    assert len(move_reminder(moved.root)) == 1 and moved.setting("triggers") == {"sequences.unfinished": {"unit": "minutes", "every": 5}}, \
        "an unreadable old value falls back to one minute and keeps the cadence already set"
