from types import SimpleNamespace

from engine.driver.open_row import OpenRow
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.rules.protected_folder_rule import ProtectedFolderRule
from suites.coding.modules.workers.rules.workers_driver_rules import WORKERS_DRIVER_RULES
from suites.coding.modules.workers.states.worker_log_due import WorkerLogDue
from suites.coding.modules.workers.types.worker import Worker

LAUNCHED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
ANCHOR = OpenRow("agent", 7, LAUNCHED)


def test_each_rule_the_worker_default_gates_keeps_its_worker_role_filter_and_is_no_ordinary_rule():
    assert all(rule.roles == [Worker.key] for rule in WorkerLogDue.rules)
    assert not set(WorkerLogDue.rules) & set(WORKERS_DRIVER_RULES)


def test_the_protected_folder_rule_stays_outside_the_default_so_removing_it_lifts_no_protection():
    assert ProtectedFolderRule not in WorkerLogDue.rules and ProtectedFolderRule in WORKERS_DRIVER_RULES


def test_the_default_is_open_on_the_workers_row_and_closed_once_removed_which_switches_its_rules_off():
    assert WorkerLogDue().open_rows(SimpleNamespace(anchor=ANCHOR, defaults=tuple(["workers.worker-log-due"]))) == [ANCHOR]
    assert WorkerLogDue().open_rows(SimpleNamespace(anchor=ANCHOR, defaults=())) == []
