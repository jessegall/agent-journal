# Stays a test: it needs a file changed by another process, a real git blob store, the real argument parser, the runner's check-in timer, the driver's send queue, and controllers no registration reaches
import time

from resources.base import AGENT, USER
from engine.gates import held
from tests.kit import idle, nudges, nudges_with_briefs, report
from tests.conftest import fresh, refused
from controllers.types import Agents, Todos, Works
from resources.base import SYSTEM
from features.work_tracking.auto import QUIET_FOR, still_there


def test_edits_without_a_log_entry_hold_the_writes_until_the_work_is_logged():
    record = fresh()
    record.set_setting("work_tracking", {"log_after": 3, "name_work_every": 2})
    works = Works(record, actor=AGENT)
    works.create("editing")
    report(record, "working", "PostToolUse", wrote=True)
    report(record, "working", "PostToolUse", wrote=True)
    assert held(record, "claude-1") == "", "under the limit: nothing held"
    report(record, "working", "PostToolUse", wrote=False)
    assert held(record, "claude-1") == "", "a read is not an edit"
    report(record, "working", "PostToolUse", wrote=True)
    assert ("journal work log" in held(record, "claude-1")) is True, "at the limit the writes are held, naming the command"
    works.action("log")("Three edits in")
    assert held(record, "claude-1") == "", "a log entry releases the hold"
    assert [n for n in nudges(record) if "in hand" in n] == ["work 1 in hand — editing"], \
        "the work in hand is whispered as the edits go by"
    report(record, "working", "PostToolUse", wrote=True)
    assert held(record, "claude-1") == "", "and the count starts over"
    from engine.stored import write_json
    from dataclasses import asdict
    from engine import triggering
    counted = triggering.last(record, "claude-1", "work_tracking").edits
    marked = triggering.mark_file(record, "claude-1", "work_tracking")
    write_json(marked, {**asdict(triggering.last(record, "claude-1", "work_tracking")), "edits": 0})
    import os, time
    os.utime(marked, ns=(time.time_ns(), time.time_ns() + 1_000_000))
    assert (counted > 0, triggering.last(record, "claude-1", "work_tracking").edits) == (True, 0), \
        "a reset written by another process, such as the server running journal work log, is read, never an old count kept in memory"
    from events.files import FileEdited
    from features.work_tracking.tracker import record_edit
    from framework.lanes import TheGit
    agents = Agents(record, actor=SYSTEM)
    agent = agents.by_session("claude-1")
    sed = {"command": "sed -i s/a/b/ a.py", "tool": "Bash", "at": 5.0, "done": 6.0}
    agents.update(agent.n, running={"command": "pytest", "tool": "Bash", "at": 7.0, "before": sed}, commands=[sed, {"command": "a.py", "tool": "Read", "at": 5.0}])
    for added in (2, 3):
        record_edit(agents.load(agent.n), record, works.rows.standing()[0], FileEdited(agent=agent.n, path="a.py", kind="edit", before="x", after="x", added=added), TheGit(record))
    counted = agents.load(agent.n)
    assert (counted.running["before"]["changed"]["added"], counted.running["before"]["files"]) == (5, ["a.py"]), \
        "an edit made while a command ran is counted on that command, even after the next one started"
    assert [one.get("changed", {}).get("added") for one in counted.commands] == [5, None], "and on its row in the list, never on a read at the same moment"
    record_edit(agents.load(agent.n), record, works.rows.standing()[0], FileEdited(agent=agent.n, path="b.py", kind="edit", before="0" * 40, after="1" * 40, added=0), TheGit(record))
    assert [f["path"] for f in works.rows.standing()[0].changed if f["path"] == "b.py"] == ["b.py"], \
        "an edit whose before blob was never stored is counted against an empty file, never a KeyError"


def test_on_idle_with_auto_enabled_and_nothing_open_the_next_row_is_offered():
    from types import SimpleNamespace
    from framework.loaded import FEATURES
    from framework.parts import AgentContext
    from features.work_tracking.details import CHECK_IN_MINUTES
    from features.work_tracking.nudges import nothing_happening
    record = fresh()
    idle(record)
    context = AgentContext.of(FEATURES["work_tracking"], record, Agents(record, actor=SYSTEM).by_session("claude-1"))
    quiet = SimpleNamespace(idle_for=CHECK_IN_MINUTES * 60 + 1, subagent=False, paused=False)
    assert [sent.values["seen"] for sent in nothing_happening(context, quiet)] == ["nothing is open at all"], \
        "with no work open, no ready row and nothing blocked, the agent is still asked after the interval - the one state every other nudge here returns early on"
    assert nothing_happening(context, SimpleNamespace(idle_for=60.0, subagent=False, paused=False)) == [], \
        "and not while it has only just stopped"
    todos = Todos(record, actor=USER)
    todos.create("first")
    todos.create("second")
    assert nothing_happening(context, quiet)[0].values["seen"] == "2 open to-dos", \
        "and the check-in names what it can see, so a stuck agent is told where to look"
    record.set_setting("features", {"work_tracking.auto": False})
    idle(record)
    assert nudges(record) == [], "auto off: nothing offered"

    record.features = {**record.features, "work_tracking.auto": True}
    idle(record)
    assert nudges(record) == ["todo 1 next"], "auto on: the next row is offered once per idle stretch"
    assert "do the work yourself, or send a helper" in nudges_with_briefs(record)[-1][1], \
        "the offer is worded by the mode: a builder does the work itself"
    for _ in range(4):
        idle(record)
    assert nudges(record).count("todo 1 next") == 1, "a row the agent keeps passing is offered once; the repeat says it again"
    from controllers.types import Environments
    from engine.record import Record
    from features.work_tracking.auto import automatic
    Environments(record, actor=USER).create("ticket-3", owner="ticket:3")
    Record(record.root, "spare").set_setting("features", {"work_tracking.auto": False})
    assert (automatic(Record(record.root, "ticket-3")), automatic(Record(record.root, "spare"))) == (True, False), \
        "a ticket's environment is always in auto mode, with no switch to turn it off"
    work = Works(record, actor=AGENT).create("on it", todo=1)
    idle(record, shells=1, subagents=1, monitors=1)
    assert sorted(nudges(record)[-2:]) == ["auto mode is on and work 1 stands still while todo 2 is ready", "work 1 is still open, with nothing logged"], \
        "background tasks are no wait: the open work is named, and under auto the next ready row with it"
    for _ in range(4):
        idle(record)
    unlogged = "work 1 is still open, with nothing logged"
    assert nudges(record).count(unlogged) == 3, "the open work is named three times at most while nothing about it changes"
    Works(record, actor=AGENT).action("log")("picked the approach")
    idle(record)
    assert "work 1 is still open" in nudges(record)[-2:], "a log entry is a change: it is named again"
    Works(record, actor=AGENT).complete(work.n, "done", todo=True)
    idle(record)
    assert nudges(record)[-1] == "todo 2 next", "the row closed with the work: the next row is offered"
    from engine import runtime
    agents = Agents(record, actor=SYSTEM)
    Works(record, actor=AGENT).create("on it again", todo=2)
    before = len(nudges(record))
    runtime.upgrade_mark(record.root).write_text("Installing the new files")
    idle(record)
    assert nudges(record)[before:] == [], "an agent held while the journal updates is not told to end or park its work when the hold stops it"
    runtime.upgrade_mark(record.root).unlink()
    agents.update(agents.by_session("claude-1").n, provider="claude", subagent_rows=[{"id": "t1", "session": "sub-1", "task": "Lady Lovelace: the sweep", "running": True}])
    todos.create("third")
    Works(record, actor=AGENT).action("await")("the sweep")
    before = len(nudges(record))
    idle(record)
    assert nudges(record)[before:] == ["Lady Lovelace is working while work 2 waits, and todo 3 is ready"], \
        "a working subagent is no reason to sit still: the next ready row is offered at once"
    idle(record)
    assert len(nudges(record)) == before + 1, "it is said once while nothing about the row or the work changes"

    from engine.record import Record
    from engine.settings_file import PROJECT_PARTS
    assert "work_tracking.carry on" in PROJECT_PARTS.of(Record.features), \
        "a nudge's switch is kept for the whole project, so one silenced in an environment is silent in all of them"


def test_an_agent_gone_quiet_with_work_open_is_asked_whether_it_is_still_working():
    quiet_record = fresh()
    quiet_record.features = {**quiet_record.features, "work_tracking.auto": True}
    Works(quiet_record, actor=AGENT).create("something still open")
    work = Works(quiet_record, actor=AGENT).rows.standing()[0]
    asked = still_there(quiet_record, QUIET_FOR + 60, "busy")
    assert f"work {work.n}, something still open, is still open" in asked and "end it, or say plainly what it waits on" in asked, \
        "quiet for long enough, with work open and auto on, the work is named back with what to do about it"
    assert still_there(quiet_record, QUIET_FOR + 60, "idle") == asked, \
        "an idle agent with work open is told too: idle is the state the work is most likely forgotten in"
    assert [still_there(quiet_record, 5.0, "busy"), still_there(quiet_record, QUIET_FOR + 60, "stopped")] == ["", ""], \
        "not before the time is up, and never once the agent is stopped"
    Works(quiet_record, actor=AGENT).update(work.n, parked="the machine was swapping")
    parked = still_there(quiet_record, QUIET_FOR + 60, "idle")
    assert "parked because the machine was swapping" in parked, \
        "a parked work is named too, with what it was parked for, since that is usually what has passed"
    Works(quiet_record, actor=AGENT).update(work.n, parked="", awaiting="the release workflow")
    assert still_there(quiet_record, QUIET_FOR + 60, "idle") == "", "a work that is waiting on something named has its own cadence and is left alone"
    Works(quiet_record, actor=AGENT).update(work.n, awaiting="")
    quiet_record.features = {**quiet_record.features, "work_tracking.auto": False}
    assert still_there(quiet_record, QUIET_FOR + 60, "busy") == "", "and never with auto off"
    from types import SimpleNamespace
    from features.work_tracking import auto
    quiet_record.features = {**quiet_record.features, "work_tracking.auto": True}
    typed = []
    agent = SimpleNamespace(record=quiet_record, driver=SimpleNamespace(quiet_for=lambda: QUIET_FOR + 60, send=typed.append), state=lambda: "busy")
    checking = auto.CheckIn(agent)
    assert checking.tick() == "", "a check-in does not ask the moment the agent starts"
    checking.asked_at -= auto.ASK_AGAIN + 1
    assert (checking.tick(), len(typed)) == ("asked whether it is still working", 1), "after the wait it asks the agent whether it is still working"
    assert (checking.tick(), len(typed)) == ("", 1), "and does not ask again at once"
    Works(quiet_record, actor=AGENT).update(work.n, parked="the machine was swapping")
    checking.asked_at -= auto.ASK_AGAIN + 1
    assert (checking.tick(), len(typed)) == ("asked whether it is still working", 2), "parked work is named once"
    checking.asked_at -= auto.ASK_AGAIN + 1
    assert (checking.tick(), len(typed)) == ("", 2), "and then only every fifteen minutes, not every five"

    from tests.kit import tick
    def idle_for(minutes):
        report(stopped, "idle", "Stop")
        row = agents.by_session("claude-1")
        agents.update(row.n, **{**row.data, "at": time.time() - minutes * 60})
        tick(stopped)
        return [n for n in nudges(stopped) if n.startswith("you stopped")]

    asking = fresh()
    row = Todos(asking, actor=AGENT).create("the schema")
    Todos(asking, actor=AGENT).start(row.n)
    stopped, agents = asking, Agents(asking, actor=SYSTEM)
    assert len(idle_for(6)) == 1, "work on a row is told to carry on"
    Todos(asking, actor=AGENT).ask(row.n, "Files or SQLite?", options=[{"title": "Files"}, {"title": "SQLite"}], pick=1)
    assert len(idle_for(16)) == 1, "work whose row waits on a question is left to the question"

    import json
    from controllers.types import Messages
    from providers.claude import Claude
    auto_stop_nudges = lambda: [n for n in nudges(asking) if n.startswith("auto mode is on and you stopped")]
    count = len(auto_stop_nudges())
    assert set(auto_stop_nudges()) == {"auto mode is on and you stopped - the user last wrote more than 15 minutes ago"}, "with auto mode on, an agent that stopped long after the user last spoke is told to carry on"
    idle_for(20)
    idle_for(40)
    assert len(auto_stop_nudges()) == count, "while every row waits on the user it is said once, not at every stop"
    Messages(asking, actor=USER).create("carry on please")
    idle_for(8)
    assert len(auto_stop_nudges()) == count, "the user wrote a moment ago: nothing new is said"
    row = agents.by_session("claude-1")
    agents.update(row.n, person_at=time.time())
    assert len(auto_stop_nudges()) == count, "a prompt the user typed themselves counts the same"
    transcript = asking.root / "transcript.jsonl"
    transcript.write_text(json.dumps({"type": "user", "message": {"content": [{"type": "text", "text": "[Request interrupted by user]"}]}}) + "\n")
    assert Claude().interrupted_by_user(transcript), "a turn the user stopped is read from the transcript"
    transcript.write_text(json.dumps({"type": "user", "message": {"content": [{"type": "text", "text": "go on"}]}}) + "\n")
    assert not Claude().interrupted_by_user(transcript), "any other last word is not a stop"

    from controllers.types import Todos as Rows
    from features.work_tracking.nudges import nothing_left
    from framework.parts import AgentContext
    from framework.loaded import FEATURES
    done = fresh()
    done.features = {**done.features, "work_tracking.auto": True}
    agents_here = Agents(done, actor=SYSTEM)
    agents_here.create("claude-1")
    here = AgentContext.of(FEATURES["work_tracking"], done, agents_here.by_session("claude-1"))
    assert nothing_left(here), "an environment with no work, no ready row and nothing waiting has nothing to carry on with"
    row = Rows(done, actor=AGENT).create("something to do")
    assert not nothing_left(here), "a ready row is something to carry on with"
    Rows(done, actor=AGENT).complete(row.n, "done")
    assert nothing_left(here), "and once it is closed there is nothing again"


def test_a_mistyped_command_through_the_server_says_what_is_wrong():
    from tests.kit import captured
    record = fresh()
    text, code = captured(["work", "list"], record.root)
    assert (code, "invalid choice: 'list'" in text) == (2, True), text
    text, code = captured(["work", "log"], record.root)
    assert (code != 0, "say what was decided or done" in text) == (True, True), text
    text, code = captured(["--env", record.env, "--as", AGENT, "work", "log", "words with no work open"], record.root)
    assert (code != 0, "nothing is open" in text) == (True, True), "a log entry with no work open says to start one"
    made = Works(record, actor=AGENT).create("Logging from the command line")
    for auto_stop_nudges in (["--env", record.env, "--as", AGENT, "work", "log", str(made.n), "the number first, as the nudges say"], ["--env", record.env, "--as", AGENT, "work", "log", "with the flag", "--n", str(made.n)]):
        text, code = captured(auto_stop_nudges, record.root)
        assert code == 0, text
    assert [part["body"] for part in Works(record, actor=AGENT).load(made.n).sections] == ["the number first, as the nudges say", "with the flag"], \
        "journal work log takes the work's number first or as --n"
    for auto_stop_nudges in (["await", str(made.n), "the build"], ["park", str(made.n), "something else goes first"]):
        text, code = captured(["--env", record.env, "--as", AGENT, "work", *auto_stop_nudges], record.root)
        assert code == 0, text
    parked = Works(record, actor=AGENT).load(made.n)
    assert (parked.parked, parked.awaiting) == ("something else goes first", ""), "park and await take the number first too, as the nudges print them"
    text, code = captured(["--env", record.env, "--as", AGENT, "work", "await", str(made.n), "the user to answer my question"], record.root)
    assert (code != 0, "being idle, not waiting" in text) == (True, True), \
        "waiting for the user is being idle: a wait is for something that happens on its own and lets the work go on, so the journal refuses it and names what to do instead"
    text, code = captured(["--env", record.env, "--as", AGENT, "work", "log", str(made.n), "too late"], record.root)
    assert (code != 0, "is parked" in text) == (True, True), "a log entry names the work it was meant for when that work is parked"
    text, code = captured(["--env", record.env, "--as", AGENT, "work", "resume", str(made.n)], record.root)
    assert (code, Works(record, actor=AGENT).load(made.n).parked) == (0, ""), text
    text, code = captured(["--env", record.env, "--as", AGENT, "work", "resume", str(made.n)], record.root)
    assert (code != 0, "is not parked" in text) == (True, True), "work that is already going cannot be resumed"


def test_one_to_do_is_in_hand_until_it_is_parked_or_done():
    record = fresh()
    todos, works = Todos(record, actor=AGENT), Works(record, actor=AGENT)
    first, second, third = (todos.create(title) for title in ("first", "second", "third"))
    todos.start(first.n)
    assert refused(lambda: todos.start(second.n)).startswith(f"todo {first.n} is in hand"), "a second to-do waits and the one in hand is named"
    works.action("park")("the build is slow")
    todos.start(second.n)
    todos.complete(second.n, how="shipped")
    assert works.active() is None, "a to-do that is done ends its work"
    assert todos.start(third.n).todo == third.n, "so the next one starts"
    works.complete(works.active().n, how="set aside")
    assert todos.load(third.n).status == "", "work that ends without its to-do puts the to-do back on the list"


def test_a_line_queued_before_a_wait_is_dropped_once_the_wait_is_declared(monkeypatch):
    from tests.kit import Engine
    from providers import DRIVERS
    record = fresh()
    report(record, "working", "PreToolUse")
    engine = Engine(record, DRIVERS["claude"](record, "claude-1"))
    driver, delivered = engine.agent.driver, []
    monkeypatch.setattr(driver, "_deliver", lambda line, by: delivered.append(line))
    driver.sent_at = time.time()
    driver.send("a message from the user", yielding="work 1 in hand")
    works = Works(record, actor=AGENT)
    works.create("the release")
    works.action("await")("the CI run on main")
    driver.sent_at = 0
    driver.pump()
    assert delivered == ["a message from the user"], "the wait began while the line was queued: it is dropped, the user's line is not"
