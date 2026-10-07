import time

from resources.base import AGENT, USER
from engine.gates import held
from tests.kit import idle, nudges, report
from tests.conftest import fresh, refused
from controllers.types import Agents, Nudges, Questions, Todos, Works
from resources.base import SYSTEM
from features.work_tracking.auto import QUIET_FOR, still_there
from features.work_tracking.next import ready
from resources.base import AGENT, USER
from tests.kit import idle, nudges


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
    from features import trigger
    counted = trigger.last(record, "claude-1", "work_tracking").edits
    marked = trigger._file(record, "claude-1", "work_tracking")
    write_json(marked, {**trigger.asdict(trigger.last(record, "claude-1", "work_tracking")), "edits": 0})
    import os, time
    os.utime(marked, ns=(time.time_ns(), time.time_ns() + 1_000_000))
    assert (counted > 0, trigger.last(record, "claude-1", "work_tracking").edits) == (True, 0), \
        "a reset written by another process, such as the server running journal work log, is read, never an old count kept in memory"
    from engine.events.engine import FileEdited
    from features.work_tracking.tracker import record_edit
    agents = Agents(record, actor=SYSTEM)
    agent = agents.by_session("claude-1")
    sed = {"command": "sed -i s/a/b/ a.py", "tool": "Bash", "at": 5.0, "done": 6.0}
    agents.update(agent.n, running={"command": "pytest", "tool": "Bash", "at": 7.0, "before": sed}, commands=[sed, {"command": "a.py", "tool": "Read", "at": 5.0}])
    for added in (2, 3):
        record_edit(agents.load(agent.n), record, works.rows.standing()[0], FileEdited(agent=agent.n, path="a.py", kind="edit", before="x", after="x", added=added))
    counted = agents.load(agent.n)
    assert (counted.running["before"]["changed"]["added"], counted.running["before"]["files"]) == (5, ["a.py"]), \
        "an edit made while a command ran is counted on that command, even after the next one started"
    assert [one.get("changed", {}).get("added") for one in counted.commands] == [5, None], "and on its row in the list, never on a read at the same moment"


def test_on_idle_with_auto_enabled_and_nothing_open_the_next_row_is_offered():
    record = fresh()
    todos = Todos(record, actor=USER)
    todos.create("first")
    todos.create("second")
    record.set_setting("features", {"work_tracking.auto": False})
    idle(record)
    assert nudges(record) == [], "auto off: nothing offered"
    record.features = {**record.features, "work_tracking.auto": True}
    idle(record)
    assert nudges(record) == ["todo 1 next"], "auto on: the next row is offered once per idle stretch"
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
    assert nudges(record)[-2:] == ["work 1 is still open, with nothing logged", "auto mode is on and work 1 stands still while todo 2 is ready"], \
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


def test_an_agent_gone_quiet_with_work_open_is_asked_whether_it_is_still_working():
    quiet_record = fresh()
    quiet_record.features = {**quiet_record.features, "work_tracking.auto": True}
    Works(quiet_record, actor=AGENT).create("something still open")
    assert "still working" in still_there(quiet_record, QUIET_FOR + 60, "busy"), \
        "quiet for long enough, with work open and auto on, earns the question"
    assert [still_there(quiet_record, QUIET_FOR + 60, "idle"), still_there(quiet_record, 5.0, "busy")] == ["", ""], \
        "not while it is answering, not while it is idle, and not before the time is up"
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

    from tests.kit import tick
    stopped = fresh()
    works = Works(stopped, actor=AGENT)
    works.create("the release")
    agents = Agents(stopped, actor=SYSTEM)

    def idle_for(minutes):
        report(stopped, "idle", "Stop")
        row = agents.by_session("claude-1")
        agents.update(row.n, **{**row.data, "at": time.time() - minutes * 60})
        tick(stopped)
        return [n for n in nudges(stopped) if n.startswith("you stopped")]

    assert idle_for(4) == [], "four minutes after it stopped is not yet standing still"
    assert idle_for(6) == ["you stopped with work 1, the release, in hand"], "five minutes after it stopped with work in hand it is told to carry on"
    assert (len(idle_for(8)), len(idle_for(16)), len(idle_for(50))) == (1, 1, 1), "once: saying it again is the repeat's job"
    asking = fresh()
    row = Todos(asking, actor=AGENT).create("the schema")
    Todos(asking, actor=AGENT).start(row.n)
    stopped, agents = asking, Agents(asking, actor=SYSTEM)
    assert len(idle_for(6)) == 1, "work on a row is told to carry on"
    Todos(asking, actor=AGENT).ask(row.n, "Files or SQLite?")
    assert len(idle_for(16)) == 1, "work whose row waits on a question is left to the question"


def test_ready_rows_are_ordered_by_priority_then_by_number_skipping_what_is_not_ready():
    record = fresh()
    todos = Todos(record, actor=USER)
    a, b, c, d, e = (todos.create(t) for t in ("a", "b", "c", "d", "e"))
    assert ready(record)[0].n == a.n, "nothing set: the first row by number"
    todos.priority(c.n, "critical")
    assert [t.n for t in ready(record)] == [c.n, a.n, b.n, d.n, e.n], "a higher priority comes first"
    todos.priority(e.n, "high")
    todos.priority(b.n, "low")
    assert [t.n for t in todos.all()] == [c.n, e.n, a.n, d.n, b.n], "the list itself is ordered by priority, then number"
    assert refused(lambda: todos.priority(a.n, "urgent")) == "a priority is a number or one of low, default, high, critical", \
        "a priority is a level name or a number, nothing else"
    todos.priority(e.n, "default")
    todos.priority(b.n, "100")
    todos.set(c.n, "blocked", "the release is not cut")
    assert ready(record)[0].n == a.n, "a blocked row is skipped"
    todos.after(a.n, str(b.n))
    assert ready(record)[0].n == b.n, "a row waiting on an open row is skipped"
    todos.complete(b.n, "done")
    assert ready(record)[0].n == a.n, "its prerequisite closed, the row is ready again"
    Questions(record, actor=AGENT).create("which way", about=a.ref).n
    Questions(record, actor=AGENT).link(1, a.ref)
    assert ready(record)[0].n == d.n, "a row with an open question waits on the user"
    work = Todos(record, actor=AGENT).start(d.n)
    Works(record, actor=AGENT).update(work.n, parked="a subagent holds it")
    assert ready(record)[0].n == e.n, "a row whose work is open, even parked, is not offered again"
    Questions(record, actor=USER).complete(1, "this way")
    assert ready(record)[0].n == a.n, "answered: the row is ready"
    for t in ready(record):
        todos.complete(t.n, "done")
    assert ready(record) == [], "nothing ready: nothing"


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
    for said in (["--env", record.env, "--as", AGENT, "work", "log", str(made.n), "the number first, as the nudges say"], ["--env", record.env, "--as", AGENT, "work", "log", "with the flag", "--n", str(made.n)]):
        text, code = captured(said, record.root)
        assert code == 0, text
    assert [part["body"] for part in Works(record, actor=AGENT).load(made.n).sections] == ["the number first, as the nudges say", "with the flag"], \
        "journal work log takes the work's number first or as --n"
    for said in (["await", str(made.n), "the build"], ["park", str(made.n), "something else goes first"]):
        text, code = captured(["--env", record.env, "--as", AGENT, "work", *said], record.root)
        assert code == 0, text
    parked = Works(record, actor=AGENT).load(made.n)
    assert (parked.parked, parked.awaiting) == ("something else goes first", ""), "park and await take the number first too, as the nudges print them"
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


def test_an_idle_agent_under_auto_is_offered_the_next_row_even_when_its_idle_report_was_lost():
    from tests.kit import tick
    record = fresh()
    record.features = {**record.features, "work_tracking.auto": True}
    from controllers.types import Agents
    from engine.stored import write_text
    row = Todos(record, actor=USER).create("waiting")
    report(record, "working", "PreToolUse")
    agents = Agents(record, actor=USER)
    agent = agents.by_session("claude-1")
    agent.data["status"] = "idle"
    write_text(agents.path(agent.n), agent.dump())
    assert nudges(record) == [], "the turn ended without its report, so nothing was offered"
    tick(record)
    tick(record)
    assert [n for n in nudges(record) if n == f"todo {row.n} next"] == [f"todo {row.n} next"], \
        "the engine's clock offers it once, when the report that ends a turn never came"


def test_parked_and_blocked_rows_are_named_back_to_the_agent():
    record = fresh()
    report(record, "working", "PreToolUse")
    works, todos = Works(record, actor=AGENT), Todos(record, actor=AGENT)
    first = works.create("the slow build")
    works.action("park")("the build takes an hour")
    second = works.create("a quick fix")
    works.complete(second.n, how="fixed")
    parked = f"work {first.n}, the slow build, is still parked - can you continue it now?"
    assert nudges(record)[-1] == parked, "ending work reminds the agent of the work it parked"
    todos.complete(todos.create("a row done right after").n, how="done")
    assert nudges(record).count(parked) == 1, "not again within the minute, so closing several at once says it once"
    record.state("work_tracking").set("parked_named", 0)
    todos.complete(todos.create("a row done later").n, how="done")
    assert nudges(record).count(parked) == 2, "later, closing a to-do reminds it too"

    record.set_setting("work_tracking", {"ask_blocked_every": 2})
    base, extra = todos.create("the base"), todos.create("another base")
    waiting = todos.create("built on both")
    todos.after(waiting.n, str(base.n))
    todos.after(waiting.n, str(extra.n))
    stuck = todos.create("the migration")
    todos.block(stuck.n, "the user decides the schema")
    decided = todos.create("the pricing")
    todos.block(decided.n, "the user picks a price")
    todos.ask(decided.n, "Which price, 5 or 7?")
    todos.complete(base.n, how="done")
    assert (todos.waits(todos.load(waiting.n)), any("is unblocked" in n for n in nudges(record))) == ([f"todo:{extra.n}"], False), \
        "one of two rows closed: it still waits on the other, and nothing is said"
    todos.complete(extra.n, how="done")
    assert nudges(record)[-2:].count(f"todo {waiting.n}, built on both, is unblocked - todo {extra.n} closed") == 1, \
        "the last one closed: the agent is told the row is unblocked"
    todos.reopen(extra.n, "not done after all")
    assert todos.waits(todos.load(waiting.n)) == [f"todo:{extra.n}"], "the row keeps what it waits on, so reopening one makes it wait again"
    todos.complete(extra.n, how="done")
    blocked = f"todo {stuck.n}, the migration, is still blocked - is it still?"
    assert nudges(record).count(blocked) == 1, "a row blocked from outside is asked about every second closed to-do, not in between"
    assert not any(f"todo {decided.n}," in n for n in nudges(record)), "a row that already waits on a question is not asked about again"
    todos.complete(todos.create("one more").n, how="done")
    assert nudges(record).count(blocked) == 1, "a row just asked about is not asked again within the minute, however many close"
    record.state("work_tracking").set("asked", {})
    todos.complete(todos.create("and one more").n, how="done")
    todos.complete(todos.create("and the last").n, how="done")
    assert nudges(record).count(blocked) == 2, "later, it is asked again"


def test_a_declared_wait_is_asked_about_and_cleared_when_the_work_moves():
    from tests.kit import tick
    record = fresh()
    report(record, "working", "PreToolUse")
    works = Works(record, actor=AGENT)
    build = works.create("the release")
    textless = {"tool": "Bash", "at": 1.0}
    for i in range(1, 5):
        report(record, "working", "PostToolUse", commands=[textless] * i)
    assert not [n for n in nudges(record) if "same check" in n], "a shell call with no command text is nothing to have repeated"
    check = {"tool": "Bash", "command": "tail -3 build.log", "at": 1.0}
    for i in range(1, 5):
        report(record, "working", "PostToolUse", commands=[check] * i)
    polling = [n for n in nudges(record) if "same check" in n]
    assert polling == ["you ran the same check 3 times in a row - tail -3 build.log"], "the third identical check in a row is named once, pointing at await"
    wakes = {}
    for provider in ("claude", "codex"):
        place = fresh()
        Works(place, actor=AGENT).create("the release")
        for i in range(1, 4):
            report(place, "working", "PostToolUse", commands=[check] * i, provider=provider)
        wakes[provider] = [("tells you itself when it ends" in n.brief, "tells you when a" in n.brief) for n in Nudges(place).all() if "same check" in n.title]
    assert wakes == {"claude": [(True, False)], "codex": [(False, True)]}, "each provider is told what wakes it"
    works.action("await")("the CI run on main")
    Todos(record, actor=USER).create("next up")
    record.features = {**record.features, "work_tracking.auto": True}
    idle(record)
    assert not [n for n in nudges(record) if "still open" in n or "stands still" in n], "a declared wait holds the end-or-park line and the auto offer"
    works.update(build.n, awaiting_since=works.load(build.n).awaiting_since - 60)
    tick(record)
    assert not [n for n in nudges(record) if n.startswith("check the CI run")], "a minute in, the wait is left alone"
    works.update(build.n, awaiting_since=works.load(build.n).awaiting_since - 300)
    tick(record)
    assert nudges(record)[-1] == "check the CI run on main now - you have waited 6 min", \
        "five minutes in, the agent is sent to look at the thing it waits on"
    works.action("log")("CI passed")
    assert works.load(build.n).awaiting == "the CI run on main", "a log entry leaves the wait standing"
    since = works.load(build.n).awaiting_since
    report(record, "working", "PostToolUse", tool="Bash", wrote=True, commands=[{"command": "journal work await", "tool": "Bash", "at": since - 1}])
    assert works.load(build.n).awaiting == "the CI run on main", "the call that declared the wait does not end it"
    report(record, "working", "PostToolUse", tool="Bash", wrote=True, commands=[{"command": "journal work await", "tool": "Bash", "at": since}])
    assert works.load(build.n).awaiting == "the CI run on main", "nor does a call started the same instant"
    report(record, "working", "PostToolUse", tool="Read", wrote=False, commands=[{"command": "tail test.log", "tool": "Bash", "at": time.time()}])
    assert works.load(build.n).awaiting == "the CI run on main", "reading, checking and answering messages leave the wait standing"
    report(record, "working", "PostToolUse", tool="Edit", wrote=True, commands=[{"command": "Edit a.py", "tool": "Edit", "at": time.time()}])
    assert works.load(build.n).awaiting == "", "writing again clears it"
    assert [n for n in nudges(record) if "your wait for the CI run on main is over" in n], "and the agent is told why"
    from controllers.types import Facts
    Facts(record, actor=AGENT).create("the port is 8423", keywords=["port"])
    works.action("await")("the CI run again")
    before = len(nudges(record))
    tick(record)
    report(record, "idle", "Stop")
    assert [n for n in nudges(record)[before:] if "standing, read them" in n] == [], "the repeating lines stay quiet while a wait stands"
    works.action("await")("the deploy")
    works.action("park")("the release goes out tomorrow")
    assert works.load(build.n).awaiting == "", "parking clears the wait"
    from providers import PROVIDERS
    from runner.hooks import handle
    shell = lambda command, **more: handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-wait", "tool_name": "Bash",
                                                                                           "tool_input": {"command": command, **more}})
    for waiting in ("sleep 30", "until grep -q done b.log; do sleep 5; done", "while true; do sleep 2; done", "sleep 1 && sleep 2"):
        assert "await tag" in shell(waiting).get("reason", ""), f"{waiting} only waits and is refused, naming the await tag"
    for working in ("sleep 1 && pytest -q", "until grep -q done b.log; do tail -1 b.log; sleep 5; done", "python3 wait_for_it.py"):
        assert shell(working).get("decision") != "block", f"{working} does real work and passes"
    assert shell("sleep 30", run_in_background=True).get("decision") != "block", "a sleep in the background blocks nothing"


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
    from migrations.m0005_todo_waits import run as waits_move
    older = fresh()
    todos = Todos(older, actor=AGENT)
    first, second = todos.create("first"), todos.create("second")
    todos.link(second.n, first.ref)
    todos.link(second.n, "doc:1")
    assert waits_move(older.root) == [second.ref], "a to-do that listed another to-do among its links now waits on it"
    waiting = todos.load(second.n)
    assert (waiting.after, waiting.refs) == ([first.ref], ["doc:1"]), "the wait moves out of the links and the other links stay"
    assert waits_move(older.root) == [], "a wait that has moved is not moved again"
