import json
import threading
import time
from pathlib import Path

import features
from controllers.types import Features, Notifications
from engine import runtime
from engine.timing import measured
from features import FEATURES
from features.dev_faults.feature import DevFaults
from resources.base import SYSTEM
from tests.conftest import fresh
from tests.kit import report


def turned(record, on: bool):
    Features(record, actor=SYSTEM).switch("dev_faults", on)


def notified(record):
    return [r.title for r in Notifications(record, actor=SYSTEM).rows.every()]



def busy(seconds: float) -> None:
    began = time.thread_time()
    while time.thread_time() - began < seconds:
        pass

def test_a_slow_request_is_reported_only_when_the_budget_is_on():
    features.load()
    record = fresh()
    turned(record, False)
    with measured(record, "request", "GET /api/main/message"):
        busy(0.08)
    assert notified(record) == [], "switched off, nothing is filed"
    turned(record, True)
    with measured(record, "command", "check run"):
        time.sleep(0.08)
    assert notified(record) == [], "time spent waiting, as on a check a command runs, is not held against the budget"
    with measured(record, "request", "GET /api/main/message"):
        busy(0.08)
    assert notified(record) == ["request GET /api/main/message is slower than its budget"], notified(record)
    from commands.dispatch import timed
    from engine.timing import Stopwatch
    from features.routing import Reply
    for _ in range(2):
        timed(Reply(200, {}, after=lambda: busy(0.08)), record.root, record.env, "POST", "/api/hook/claude", Stopwatch()).after()
    assert notified(record) == ["request GET /api/main/message is slower than its budget"], \
        "work done after the answer is sent is not held against the budget the agent waits on"
    from engine.after_answer import AfterAnswer
    workers, ran = AfterAnswer.started(1), []
    with workers.answering_hook():
        workers.add(lambda: ran.append(threading.current_thread().name), "claude-1")
        time.sleep(0.1)
        assert ran == [], "work an answer leaves behind waits while a hook is still being answered"
    waited = time.monotonic() + 2
    while not ran and time.monotonic() < waited:
        time.sleep(0.01)
    assert ran == ["after-answer-0"], "then it runs on a worker thread, never on the thread that answers"
    workers, ran = AfterAnswer.started(2), []
    workers.add(lambda: (time.sleep(0.05), ran.append("first")), "claude-1")
    workers.add(lambda: ran.append("second"), "claude-1")
    waited = time.monotonic() + 2
    while len(ran) < 2 and time.monotonic() < waited:
        time.sleep(0.01)
    assert ran == ["first", "second"], "one agent's hooks are recorded in the order they came, even with a worker free"
    from engine.quiet_collector import LONGEST_BUSY, WHOLE_EVERY, YOUNG_AFTER, QuietCollector
    quiet = QuietCollector(clock=lambda: 0.0)
    assert (quiet.due(1.0, YOUNG_AFTER), quiet.due(1.0, 10)) == ((1,), ()), "young garbage is collected once enough has piled up"
    with quiet.serving():
        assert quiet.due(1.0, YOUNG_AFTER) == (), "never while a request is being answered"
        assert quiet.due(1.0 + LONGEST_BUSY, YOUNG_AFTER) == (1,), "unless it has waited too long for a quiet moment"
    assert quiet.due(WHOLE_EVERY, 0) == (2,), "and everything is collected once a minute"
    log = record.root / "runtime" / "diagnostics.log"
    assert not log.exists(), "the diagnostic log is off by default"
    record.features = {**record.features, "dev_faults.log": True}
    with measured(record, "request", "GET /api/main/message"):
        busy(0.08)
    assert "slow request GET /api/main/message" in log.read_text(), "switched on, a slow request is written to the diagnostic log"
    from commands.http import dispatch
    shown = dispatch("GET", f"/api/{record.env}/diagnostics", record.root, {"lines": "50"}, {}).body["log"]
    assert "slow request GET /api/main/message" in shown, "the viewer shows the diagnostic log in Settings"
    dispatch("POST", f"/api/{record.env}/diagnostics/clear", record.root, {}, {})
    assert dispatch("GET", f"/api/{record.env}/diagnostics", record.root, {}, {}).body["log"] == "", "and clears it"


def test_a_fast_request_is_never_reported():
    features.load()
    record = fresh()
    turned(record, True)
    with measured(record, "request", "GET /api/main/fact"):
        pass
    assert notified(record) == []


def test_going_over_again_counts_but_tells_the_agent_once():
    features.load()
    record = fresh()
    turned(record, True)
    report(record, "working", "PreToolUse")
    for _ in range(2):
        with measured(record, "command", "message all"):
            busy(0.08)
    rows = Notifications(record, actor=SYSTEM).rows.every()
    assert len(rows) == 1 and rows[0].data["times"] == 2, "one row per target, counting every overrun"
    events = [e for e in record.event_log.events() if e.type == "notification" and e.action == "updated" and e.data.get("fields")]
    assert events == [], "a repeat inside the window is stamped quietly, with no update line in the chat"
    from controllers.types import Agents
    main = Agents(record, actor=SYSTEM).primary()
    Agents(record, actor=SYSTEM).update(main.n, uses=main.uses + 30)
    with measured(record, "command", "message all"):
        busy(0.08)
    assert "Seen 3 times" in Notifications(record, actor=SYSTEM).rows.every()[0].brief, "once the agent has worked on, a fault that comes again is reported afresh with its count"
    import cProfile
    profile = cProfile.Profile()
    profile.runcall(busy, 0.01)
    reports = FEATURES["dev_faults"].reports
    reports.spent(record.root, record.env, "command", "message all", 500.0, profile=profile)
    kept = list(runtime.profiles(record.root).glob("*-message-all-500ms.txt"))
    assert len(kept) == 1 and "function calls" in kept[0].read_text(), "a slow call over the budget keeps its profile in a file named for what was slow"
    reports.spent(record.root, record.env, "command", "message all", 500.0, profile=profile)
    reports.spent(Path("/nonexistent/journal"), "main", "command", "message all", 500.0, profile=profile)
    assert len(list(runtime.profiles(record.root).glob("*-message-all-500ms.txt"))) == 1, "a slow call that cannot be filed because its journal is gone is dropped, not raised"


def test_the_budget_is_tunable_per_environment():
    features.load()
    record = fresh()
    turned(record, True)
    record.set_setting("dev_faults", {"budget.request": 0})
    with measured(record, "request", "GET /api/main/message"):
        busy(0.08)
    assert notified(record) == [], "a budget of 0 drops that budget"
    assert DevFaults().reports.milliseconds(record, "command") == 50


def test_what_the_viewer_throws_is_filed_under_the_same_switch(monkeypatch):
    features.load()
    record = fresh()
    turned(record, False)
    assert FEATURES["dev_faults"].reports.report_console(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is False, \
        "switched off, nothing is filed"
    turned(record, True)
    assert FEATURES["dev_faults"].reports.report_console(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is True
    assert notified(record) == ["the viewer threw agents.some is not a function"], notified(record)
    assert FEATURES["dev_faults"].reports.report_console(record.root, record.env, "took long", "request", "", "slow") is True, "a report of a slow request that was already filed is taken as filed"
    from features.dev_faults.developing import developing
    from features.dev_faults.diagnostics import logged
    project = record.root.parent / "dev-project"
    project.mkdir()
    (project / ".env").write_text("OTHER=1\nDEVELOPMENT_MODE=true\n")
    monkeypatch.delenv("DEVELOPMENT_MODE", raising=False)
    assert developing(project) is True, "development mode is read from the project's own .env"
    blocked = record.root.parent / "not-a-folder"
    blocked.write_text("")
    assert logged(blocked, "no place to write") is None, "a log that cannot be written is left unwritten, not crashed on"
    from controllers import faults
    from controllers.types import Notices
    record = fresh()
    assert faults.why(record.root) == "", "an engine that logged nothing has no last words"
    faults.log_file(record.root).parent.mkdir(parents=True, exist_ok=True)
    faults.log_file(record.root).write_text("\n".join(f"line {i}" for i in range(30)))
    assert faults.why(record.root).splitlines() == [f"line {i}" for i in range(16, 30)], "the last words are the last lines of its log"
    assert (faults.crashed(1, __import__("time").time()), faults.crashed(0, 0.0), faults.crashed(None, 0.0)) == (True, False, False), "only a quick non-zero exit is a crash"
    assert faults.notice_stopped(record.root, record.env, "") is True and faults.notice_stopped(record.root, record.env, "") is False, "a stopped engine is noticed once"
    faults.cleared(record.root, record.env)
    assert [n.title for n in Notices(record, actor=SYSTEM).rows.standing()] == [], "the notice closes when the engine runs again"
    try:
        raise ValueError("bad row")
    except ValueError:
        sent_lines = []
        voice = type("Voice", (), {"alive": lambda self: True, "send": lambda self, line: sent_lines.append(line)})()
        faults.threw(record.root, record.env, "the engine", voice)
        faults.threw(record.root, record.env, "the engine", voice)
    assert [n.title for n in Notices(record, actor=SYSTEM).rows.standing()] == [faults.FAULT], "the same fault is filed once"
    assert len(sent_lines) == 1 and "ValueError: bad row" in sent_lines[0], "and the agent is told once, with the fault"
    faults.steady(record)
    assert Notices(record, actor=SYSTEM).rows.standing() == [], "a steady engine closes the fault"
    faults.damaged(record, "todo/3.md", "bad yaml")
    assert any(faults.DAMAGED == n.title for n in Notices(record, actor=SYSTEM).rows.standing()), "a row that cannot be read is filed"
    assert faults.place_of("no frames here\nValueError: x") == "ValueError: x", "a fault with no frame is placed by its last line"
    assert faults.fault_of("") == "", "no trouble has no fault"
    notices = Notices(record, actor=SYSTEM)
    done = notices.create("a notice", brief="x")
    assert notices.complete(done.n, "ok").completed and notices.complete(done.n, "again").completed, "completing a closed notice leaves it closed"


def test_a_switch_sent_under_its_old_name_too_keeps_the_new_names_value():
    from commands.http import dispatch
    record = fresh()
    settings = dispatch("GET", f"/api/{record.env}/settings", record.root, {}, {}).body
    features = {**settings["features"], "dev_faults.budget": False}
    saved = dispatch("POST", f"/api/{record.env}/settings", record.root, {}, {"features": features}).body
    assert saved["features"]["dev_faults.budget"] is False, "the old name 'budget' in the same list must not turn it back on"


def test_the_first_seconds_after_the_server_starts_are_not_held_against_the_budget():
    features.load()
    record, reports = fresh(), FEATURES["dev_faults"].reports
    turned(record, True)
    runtime.STARTED[0] = time.time()
    try:
        reports.spent(record.root, record.env, "request", "GET /api/pages", 400)
        reports.spent(record.root, record.env, "command", "todo all", 400)
        assert notified(record) == ["command todo all is slower than its budget"], "a request that met a server still warming is let be; a command is not"
        reports.spent(record.root, record.env, "command", "search hooks", 400, whole_reads=("a search through every conversation",))
        briefs = [r.brief for r in Notifications(record, actor=SYSTEM).rows.every() if "search hooks" in r.title]
        assert any("it read a whole transcript for a search through every conversation" in brief for brief in briefs), \
            "a slow command that read a whole transcript names that read, with its reason, as part of its time"
    finally:
        runtime.STARTED[0] = 0.0
    reports.spent(record.root, record.env, "request", "GET /api/pages", 400)
    assert "request GET /api/pages is slower than its budget" in notified(record), "once warm, the budget holds again"
    reports.spent(record.root, record.env, "request", "GET /api/main/board", 400)
    assert "request GET /api/main/board is slower than its budget" not in notified(record), "a request's first, cold run after a start is let be"
    reports.spent(record.root, record.env, "request", "GET /api/main/board", 400)
    assert "request GET /api/main/board is slower than its budget" in notified(record), "its next run is held to the budget"
    from serve import environmental
    assert (environmental("/api/main/dashboard"), environmental("/api/identity")) == (True, False), \
        "a viewer request about an environment waits for the server's warm-up; a check that the server is up never does"


def test_a_slow_request_waits_while_the_agent_waits():
    from controllers.types import Works
    from resources.base import AGENT
    from tests.kit import nudges, report
    features.load()
    record, reports = fresh(), FEATURES["dev_faults"].reports
    turned(record, True)
    report(record, "working", "PreToolUse")
    work = Works(record, actor=AGENT).create("the release")
    Works(record, actor=AGENT).action("await")("the CI run")
    reports.spent(record.root, record.env, "request", "GET /api/pages", 400)
    assert not [n for n in nudges(record) if "slower than its budget" in n], "a wait hears only what needs the agent to act"
    Works(record, actor=AGENT).update(work.n, awaiting="")
    for _ in range(2):
        reports.spent(record.root, record.env, "request", "GET /api/agents", 400)
    assert [n for n in nudges(record) if "GET /api/agents" in n], "once the wait is over it is told again"


def test_a_request_a_hook_and_an_agent_report_stay_inside_their_work_budget(capsys):
    import os
    from commands.http import dispatch
    from controllers.types import Messages
    from runner.hooks import answer
    from tests.kit import counted
    from providers import PROVIDERS
    from resources.base import USER
    from tests.kit import report
    features.load()
    record = fresh()
    for i in range(40):
        Messages(record, actor=USER).create(f"message {i}")
    asked = {"types": "todo,message,question", "events": "50"}
    hooks = {"claude": {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read", "tool_input": {"file_path": "x.py"}, "cwd": str(record.root.parent)},
             "codex": {"hook_event_name": "PreToolUse", "session_id": "codex-1", "tool_name": "exec_command", "tool_input": {"cmd": "sed -n '1,20p' x.py"}, "cwd": str(record.root.parent)}}
    calls = {"the dashboard": (lambda: dispatch("GET", f"/api/{record.env}/dashboard", record.root, asked, {}), 1, 1),
             **{f"a {name} PreToolUse hook": (lambda name=name: answer(PROVIDERS[name](), record.root, hooks[name], os.getpid()), 25, 0)
                for name in hooks},
             "an agent report through every handler": (lambda: report(record, "working", "PostToolUse"), 10, 0)}
    for name, (call, opened, scanned) in calls.items():
        call()
        with counted() as work:
            call()
        assert (len(work.opened) <= opened, len(work.scanned) <= scanned) == (True, True), \
            f"{name} opens at most {opened} files and scans at most {scanned} folders once warm; it opened {work.opened} and scanned {work.scanned}"
    from commands.cli import run
    out = record.root.parent / "speed.json"
    capsys.readouterr()
    run(["--root", str(record.root), "--env", record.env, "speed", "--runs", "1", "--out", str(out)])
    table = capsys.readouterr().out
    rows = {line.rsplit(None, 1)[0].strip() for line in table.splitlines()}
    assert {"engine tick", "journal status", "server start to its first answer", "runtime/ MB"} <= rows, "the speed table times the engine, a command, the server and the runtime folder"
    assert any(row.startswith("list message (40)") for row in rows) and any(row.endswith("through the server") for row in rows), \
        "it counts the rows it lists and times commands through the server as well"
    assert json.loads(out.read_text())["runs"] == 1, "the numbers are also saved to the file asked for"


def test_a_setting_is_read_once_and_a_change_from_another_process_is_seen_after_its_event(monkeypatch):
    from pathlib import Path
    from engine.record import Record
    from engine.settings_file import SETTINGS
    from engine.stored import write_json
    from tests.kit import counted
    record = fresh()
    record.set_setting("delivery", {"mode": "one"})
    stats = []
    original = Path.stat
    monkeypatch.setattr(Path, "stat", lambda self, *a, **k: (stats.append(str(self)), original(self, *a, **k))[1])
    with counted() as work:
        for _ in range(20):
            assert record.setting("delivery") == {"mode": "one"}
    assert (work.opened, [s for s in stats if s.endswith("settings.json")]) == ([], []), "a held setting costs no open and no stat"
    write_json(record.home / "settings.json", {"delivery": {"mode": "two"}})
    assert record.setting("delivery") == {"mode": "one"}, "the file changing under a process is not noticed without the event"
    SETTINGS.clear()
    seen = Record(record.root, record.env)
    seen.setting("delivery")
    write_json(record.home / "settings.json", {"delivery": {"mode": "three"}})
    other = Record(record.root, record.env)
    event = other.emit("feature", 0, "stamped", SYSTEM, quiet=True, setting="delivery")
    assert seen.setting("delivery") == {"mode": "two"}, "the view of another process holds until the event reaches it"
    features.passed(event, seen)
    assert seen.setting("delivery") == {"mode": "three"}, "the event makes it read the file again"
    from features import switches
    monkeypatch.setattr(switches, "UNEVENTED", [False])
    switches.watch_change_log()
    held = switches.switches(record).get("dev_faults", False)
    turned(record, not held)
    assert (switches.UNEVENTED, switches.switches(record).get("dev_faults", False)) == ([True], not held), \
        "a process that watches the change log sees a switch another process turned, without waiting for an event"
    assert switches.written(Record(record.root, "never-written")) == 0, "an environment with no change log has written nothing"
    warmed = []
    monkeypatch.setattr(switches, "WARMERS", [lambda: warmed.append(1)])
    turned(record, held)
    assert warmed == [1], "what a switch clears, such as the command parser, is built again once the change is made, never by the next request"
    assert DevFaults.details.values(record) is DevFaults.details.values(record), "a feature's settings are read once until they change"
    from controllers.types import Environments, Todos
    from features.format import shaped
    features.load(record.root)
    plain, naming = Todos(record, actor=SYSTEM).create("the header"), Todos(record, actor=SYSTEM).create("ask todo 1 in elsewhere")
    held, before = (shaped(plain, record), shaped(naming, record)), switches.generation()
    seated, seat = [], features.seat
    monkeypatch.setattr(features, "seat", lambda root, homes: (seated.append(homes), seat(root, homes)))
    Environments(record, actor=SYSTEM).create("elsewhere")
    features.load(record.root)
    assert (switches.generation() == before, shaped(plain, record) is held[0], shaped(naming, record) is held[1]) == (True, True, False), \
        "a new environment keeps the switches and formatted rows of the others, and forgets only the rows that name it"
    assert seated == [("elsewhere",)], "only the new environment has its feature rows set up"
    from controllers.types import Todos
    from engine.gates import held
    title = Notifications(record, actor=SYSTEM).rows.every()[0].title
    todos = Todos(record, actor=SYSTEM)
    assert [t.title for t in todos.rows.standing()] == [title], "the first breach of a command files a to-do of its own"
    todos.complete(todos.rows.standing()[0].n, "closed while the breach goes on")
    for _ in range(25):
        reports.slow(record, "command", "message all", 500.0, working=500.0)
    assert "before any other write" in held(record, main.title), "a breach seen over and over with no to-do open holds the agent's writes"
    todos.create(title)
    assert held(record, main.title) == "", "filing the to-do lifts the hold"
