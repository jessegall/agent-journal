import time

import features
from controllers.types import Features, Notifications
from features import FEATURES
from features.dev_faults.feature import Faults
from resources.base import SYSTEM
from tests.conftest import fresh


def turned(record, on: bool):
    Features(record, actor=SYSTEM).switch("dev_faults", on)


def told(record):
    return [r.title for r in Notifications(record, actor=SYSTEM)._every()]


def test_a_slow_request_is_reported_only_when_the_budget_is_on():
    features.load()
    record = fresh()
    turned(record, False)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == [], "switched off, nothing is filed"
    turned(record, True)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == ["request GET /api/main/message is slower than its budget"], told(record)


def test_a_fast_request_is_never_reported():
    features.load()
    record = fresh()
    turned(record, True)
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/fact"):
        pass
    assert told(record) == []


def test_going_over_again_counts_but_tells_the_agent_once():
    features.load()
    record = fresh()
    turned(record, True)
    for _ in range(2):
        with FEATURES["dev_faults"].reports.watched(record.root, record.env, "command", "message all"):
            time.sleep(0.08)
    rows = Notifications(record, actor=SYSTEM)._every()
    assert len(rows) == 1 and rows[0].data["times"] == 2, "one row per target, counting every overrun"
    assert rows[0].data["told"] > 0


def test_the_budget_is_tunable_per_environment():
    features.load()
    record = fresh()
    turned(record, True)
    record.budget = {"request": 0}
    with FEATURES["dev_faults"].reports.watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == [], "a budget of 0 drops that budget"
    assert Faults().reports.milliseconds(record, "command") == 50


def test_what_the_viewer_throws_is_filed_under_the_same_switch():
    features.load()
    record = fresh()
    turned(record, False)
    assert FEATURES["dev_faults"].reports.heard(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is False, \
        "switched off, nothing is filed"
    turned(record, True)
    assert FEATURES["dev_faults"].reports.heard(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is True
    assert told(record) == ["the viewer threw agents.some is not a function"], told(record)


def test_a_switch_sent_under_its_old_name_too_keeps_the_new_names_value():
    from commands.http import dispatch
    record = fresh()
    settings = dispatch("GET", f"/api/{record.env}/settings", record.root, {}, {}).body
    features = {**settings["features"], "dev_faults.budget": False}
    saved = dispatch("POST", f"/api/{record.env}/settings", record.root, {}, {"features": features}).body
    assert saved["features"]["dev_faults.budget"] is False, "the old name 'budget' in the same list must not turn it back on"
