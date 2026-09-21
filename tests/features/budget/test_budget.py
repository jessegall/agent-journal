import time

import features
from controllers.types import Features, Notifications
from features.budget.feature import Budget, watched
from resources.base import SYSTEM
from tests.conftest import fresh


def turned(record, on: bool):
    Features(record, actor=SYSTEM).switch("budget", on)


def told(record):
    return [r.title for r in Notifications(record, actor=SYSTEM)._every()]


def test_a_slow_request_is_reported_only_when_the_budget_is_on():
    features.load()
    record = fresh()
    with watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == [], "off by default, so nothing should be filed"
    turned(record, True)
    with watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == ["request GET /api/main/message is slower than its budget"], told(record)


def test_a_fast_request_is_never_reported():
    features.load()
    record = fresh()
    turned(record, True)
    with watched(record.root, record.env, "request", "GET /api/main/fact"):
        pass
    assert told(record) == []


def test_going_over_twice_updates_the_one_row():
    features.load()
    record = fresh()
    turned(record, True)
    for _ in range(2):
        with watched(record.root, record.env, "command", "message all"):
            time.sleep(0.08)
    rows = Notifications(record, actor=SYSTEM)._every()
    assert len(rows) == 1 and rows[0].data["times"] == 2, [(r.title, r.data) for r in rows]


def test_the_budget_is_tunable_per_environment():
    features.load()
    record = fresh()
    turned(record, True)
    record.budget = {"request": 0}
    with watched(record.root, record.env, "request", "GET /api/main/message"):
        time.sleep(0.08)
    assert told(record) == [], "a budget of 0 drops that budget"
    assert Budget().milliseconds(record, "command") == 50
