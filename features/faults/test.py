import time

import features
from controllers.types import Features, Notifications
from features import FEATURES
from features.faults.feature import Faults
from resources.base import SYSTEM
from tests.conftest import fresh


def turned(record, on: bool):
    Features(record, actor=SYSTEM).switch("faults", on)


def told(record):
    return [r.title for r in Notifications(record, actor=SYSTEM)._every()]


def test_a_slow_request_is_reported_only_when_the_budget_is_on():
    features.load()
    record = fresh()
    turned(record, False)
    with FEATURES["faults"].watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == [], "switched off, nothing is filed"
    turned(record, True)
    with FEATURES["faults"].watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == ["request GET /api/main/message is slower than its budget"], told(record)


def test_a_fast_request_is_never_reported():
    features.load()
    record = fresh()
    turned(record, True)
    with FEATURES["faults"].watched(record.root, record.env, "request", "GET /api/main/fact"):
        pass
    assert told(record) == []


def test_going_over_twice_within_a_minute_writes_one_row_once():
    features.load()
    record = fresh()
    turned(record, True)
    for _ in range(2):
        with FEATURES["faults"].watched(record.root, record.env, "command", "message all"):
            time.sleep(0.08)
    rows = Notifications(record, actor=SYSTEM)._every()
    assert len(rows) == 1 and rows[0].data["times"] == 1, "a second overrun within the minute is not written again"


def test_the_budget_is_tunable_per_environment():
    features.load()
    record = fresh()
    turned(record, True)
    record.budget = {"request": 0}
    with FEATURES["faults"].watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == [], "a budget of 0 drops that budget"
    assert Faults().milliseconds(record, "command") == 50


def test_what_the_viewer_throws_is_filed_under_the_same_switch():
    features.load()
    record = fresh()
    turned(record, False)
    assert FEATURES["faults"].heard(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is False, \
        "switched off, nothing is filed"
    turned(record, True)
    assert FEATURES["faults"].heard(record.root, record.env, "agents.some is not a function", "Sidebar.vue", "at r") is True
    assert told(record) == ["the viewer threw agents.some is not a function"], told(record)
