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


def test_a_slow_request_is_reported_only_when_the_budget_is_on():
    features.load()
    record = fresh()
    turned(record, False)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert notified(record) == [], "switched off, nothing is filed"
    turned(record, True)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
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
            time.sleep(0.08)
    rows = Notifications(record, actor=SYSTEM)._every()
    assert len(rows) == 1 and rows[0].data["times"] == 2, "one row per target, counting every overrun"
    assert rows[0].data["notified_at"] > 0


def test_the_budget_is_tunable_per_environment():
    features.load()
    record = fresh()
    turned(record, True)
    record.budget = {"request": 0}
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
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


def test_what_reaches_the_network_is_not_held_against_the_budget():
    features.load()
    record, reports = fresh(), FEATURES["dev_faults"].reports
    turned(record, True)
    reports.report_console(record.root, record.env, "POST /api/main/plugin/8/upgrade took 5000ms", "POST /api/main/plugin/8/upgrade", "", "slow")
    reports.report_console(record.root, record.env, "POST /api/main/plugins/preview took 1500ms", "POST /api/main/plugins/preview", "", "slow")
    assert notified(record) == [], "installing, upgrading and previewing a plugin fetch from the network and take what they take"
    reports.report_console(record.root, record.env, "GET /api/main/dashboard took 200ms", "GET /api/main/dashboard", "", "slow")
    assert notified(record) == ["the viewer's GET /api/main/dashboard is slower than its budget"], "anything local keeps its budget"
