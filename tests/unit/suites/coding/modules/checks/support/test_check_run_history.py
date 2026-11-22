from types import MappingProxyType

from engine.event.logged_event import LoggedEvent
from engine.time.timestamp import Timestamp
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.support.check_run_history import CheckRunHistory


def run_event(number: int, **changes: tuple[object, object]) -> LoggedEvent:
    return LoggedEvent(id=number, event="check.update", row_table="checks", row_id=1, environment_id=None, actor_id=1, command="",
                       cause_id=None, skipped_guards=frozenset(), timestamp=Timestamp.parsed("2026-11-22T00:00:00+00:00"),
                       data=MappingProxyType({"last_run_at": (None, f"run {number}"), **changes}))


def test_runs_whose_events_name_no_result_take_the_result_of_the_newer_change_or_of_the_check():
    events = [run_event(1), run_event(2, last_passed=(True, False), last_output=("fine", "broke")), run_event(3, last_passed=(False, True), last_output=("broke", "fine")), run_event(4)]
    check = Check(creator_id=1, title="Server log", command="true", last_passed=True, last_output="fine")
    records = CheckRunHistory.built(events, check).records
    assert [(record.run_at, record.passed, record.output) for record in records] == [
        ("run 4", True, "fine"), ("run 3", True, "fine"), ("run 2", False, "broke"), ("run 1", True, "fine")]
