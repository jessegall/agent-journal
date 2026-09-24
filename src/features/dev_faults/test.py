import time

import features
from controllers.types import Features, Notifications
from engine import runtime
from features import FEATURES
from features.dev_faults.feature import Faults
from resources.base import SYSTEM
from tests.conftest import fresh


def turned(record, on: bool):
    Features(record, actor=SYSTEM).switch("dev_faults", on)


def notified(record):
    return [r.title for r in Notifications(record, actor=SYSTEM)._every()]



def busy(seconds: float) -> None:
    began = time.thread_time()
    while time.thread_time() - began < seconds:
        pass

def test_a_slow_request_is_reported_only_when_the_budget_is_on():
    features.load()
    record = fresh()
    turned(record, False)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        busy(0.08)
    assert notified(record) == [], "switched off, nothing is filed"
    turned(record, True)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "command", "check run"):
        time.sleep(0.08)
    assert notified(record) == [], "time spent waiting, as on a check a command runs, is not held against the budget"
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        busy(0.08)
    assert notified(record) == ["request GET /api/main/message is slower than its budget"], notified(record)


def test_a_fast_request_is_never_reported():
    features.load()
    record = fresh()
    turned(record, True)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/fact"):
        pass
    assert notified(record) == []


def test_going_over_again_counts_but_tells_the_agent_once():
    features.load()
    record = fresh()
    turned(record, True)
    for _ in range(2):
        with FEATURES["dev_faults"].reports.watched(record.root, record.env, "command", "message all"):
            busy(0.08)
    rows = Notifications(record, actor=SYSTEM)._every()
    assert len(rows) == 1 and rows[0].data["times"] == 2, "one row per target, counting every overrun"
    events = [e for e in record.events() if e.type == "notification" and e.action == "updated" and e.data.get("fields")]
    assert events == [], "a repeat inside the window is stamped quietly, with no update line in the chat"


def test_the_budget_is_tunable_per_environment():
    features.load()
    record = fresh()
    turned(record, True)
    record.set_setting("dev_faults", {"budget.request": 0})
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        busy(0.08)
    assert notified(record) == [], "a budget of 0 drops that budget"
    assert Faults().reports.milliseconds(record, "command") == 50


def test_what_the_viewer_throws_is_filed_under_the_same_switch():
    features.load()
    record = fresh()
    turned(record, False)
    assert FEATURES["dev_faults"].reports.report_console(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is False, \
        "switched off, nothing is filed"
    turned(record, True)
    assert FEATURES["dev_faults"].reports.report_console(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is True
    assert notified(record) == ["the viewer threw agents.some is not a function"], notified(record)


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
    finally:
        runtime.STARTED[0] = 0.0
    reports.spent(record.root, record.env, "request", "GET /api/pages", 400)
    assert "request GET /api/pages is slower than its budget" in notified(record), "once warm, the budget holds again"


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
    reports.spent(record.root, record.env, "request", "GET /api/agents", 400)
    assert [n for n in nudges(record) if "GET /api/agents" in n], "once the wait is over it is told again"


def test_a_request_a_hook_and_an_agent_report_stay_inside_their_work_budget():
    import os
    from commands.http import dispatch
    from controllers.types import Messages
    from engine.hooks import answer
    from features.dev_faults.counting import counted
    from providers import PROVIDERS
    from resources.base import USER
    from tests.kit import report
    features.load()
    record = fresh()
    for i in range(40):
        Messages(record, actor=USER).create(f"message {i}")
    asked = {"types": "todo,message,question", "events": "50"}
    hook = {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read", "tool_input": {"file_path": "x.py"}, "cwd": str(record.root.parent)}
    calls = {"the dashboard": (lambda: dispatch("GET", f"/api/{record.env}/dashboard", record.root, asked, {}), 1, 1),
             "a PreToolUse hook": (lambda: answer(PROVIDERS["claude"](), record.root, hook, os.getpid()), 25, 0),
             "an agent report through every handler": (lambda: report(record, "working", "PostToolUse"), 10, 0)}
    for name, (call, opened, scanned) in calls.items():
        call()
        with counted() as work:
            call()
        assert (len(work.opened) <= opened, len(work.scanned) <= scanned) == (True, True), \
            f"{name} opens at most {opened} files and scans at most {scanned} folders once warm; it opened {work.opened} and scanned {work.scanned}"
