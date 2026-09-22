
from controllers.types import Todos, Works
from resources.base import AGENT, USER
from features.base import held
from tests.kit import idle, nudges, report
from tests.conftest import fresh, refused
from controllers.types import Questions, Todos, Works
from features.work_tracking.auto import QUIET_FOR, launch_args, still_there
from features.work_tracking.next import next, ready
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


def test_on_idle_with_auto_enabled_and_nothing_open_the_next_row_is_offered():
    record = fresh()
    todos = Todos(record, actor=USER)
    todos.create("first")
    todos.create("second")
    idle(record)
    assert nudges(record) == [], "auto off: nothing offered"
    record.features = {**record.features, "work_tracking.auto": True}
    idle(record)
    assert nudges(record) == ["todo 1 next"], "auto on: the next row is offered once per idle stretch"
    record.set_setting("permission_prompts", {"skip": False})
    assert launch_args(record, "claude", ["--model", "sonnet"]) == ["--permission-mode", "auto", "--model", "sonnet"], \
        "auto launches Claude with its automatic approval mode"
    assert launch_args(record, "codex", ["--model", "gpt-5"]) == ["--approve-for-me", "--model", "gpt-5"], \
        "auto launches Codex with its automatic approval mode"
    assert launch_args(record, "claude", ["--permission-mode=dontAsk"]) == ["--permission-mode=dontAsk"], \
        "an explicit Claude permission choice wins"
    assert launch_args(record, "codex", ["--ask-for-approval", "never"]) == ["--ask-for-approval", "never"], \
        "an explicit Codex approval choice wins"
    work = Works(record, actor=AGENT).create("on it", todo=1)
    idle(record)
    assert nudges(record) == ["todo 1 next", "work 1 is still open, with nothing logged"], \
        "work open: nothing offered; the work feature speaks instead"
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


def test_ready_rows_are_ordered_by_priority_then_by_number_skipping_what_is_not_ready():
    record = fresh()
    todos = Todos(record, actor=USER)
    a, b, c, d, e = (todos.create(t) for t in ("a", "b", "c", "d", "e"))
    assert next(record).n == a.n, "nothing set: the first row by number"
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
    assert next(record).n == a.n, "a blocked row is skipped"
    todos.after(a.n, str(b.n))
    assert next(record).n == b.n, "a row waiting on an open row is skipped"
    todos.complete(b.n, "done")
    assert next(record).n == a.n, "its prerequisite closed, the row is ready again"
    Questions(record, actor=AGENT).create("which way", about=a.ref).n
    Questions(record, actor=AGENT).link(1, a.ref)
    assert next(record).n == d.n, "a row with an open question waits on the user"
    work = Todos(record, actor=AGENT).start(d.n)
    Works(record, actor=AGENT).update(work.n, parked="a subagent holds it")
    assert next(record).n == e.n, "a row whose work is open, even parked, is not offered again"
    Questions(record, actor=USER).complete(1, "this way")
    assert next(record).n == a.n, "answered: the row is ready"
    for t in ready(record):
        todos.complete(t.n, "done")
    assert next(record) is None, "nothing ready: nothing"


def test_a_mistyped_command_through_the_server_says_what_is_wrong():
    from commands.cli import captured
    record = fresh()
    text, code = captured(["work", "list"], record.root)
    assert (code, "invalid choice: 'list'" in text) == (2, True), text
    text, code = captured(["work", "log"], record.root)
    assert (code, "arguments are required: text" in text) == (2, True), text


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
