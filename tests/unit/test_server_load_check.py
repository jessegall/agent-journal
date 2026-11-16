import importlib.util
from datetime import datetime, timedelta, timezone
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "checks" / "server_load.py"
specification = importlib.util.spec_from_file_location("server_load", SCRIPT)
queue_wait_check = importlib.util.module_from_spec(specification)
specification.loader.exec_module(queue_wait_check)

NOW = datetime(2026, 11, 14, 12, 0, tzinfo=timezone.utc)


def row(queued_minutes_old: float, waited_seconds: float | None, line: str = "pytest tests") -> dict:
    queued = NOW - timedelta(minutes=queued_minutes_old)
    started = None if waited_seconds is None else queued + timedelta(seconds=waited_seconds)
    return {"queued_at": queued.isoformat(), "started_at": None if started is None else started.isoformat(), "line": line}


def test_a_run_that_never_waited_is_no_queue_wait():
    assert queue_wait_check.queue_waits([{"queued_at": None, "started_at": NOW.isoformat(), "line": "ls"}], NOW) == []


def test_a_run_still_waiting_has_waited_until_now():
    waits = queue_wait_check.queue_waits([row(2, None)], NOW)
    assert [wait.seconds for wait in waits] == [120]


def test_waits_above_the_limit_in_every_minute_of_the_window_fail_and_name_the_longest_run():
    waits = queue_wait_check.queue_waits([row(6, 200, "go test first"), row(3, 200, "pytest second"), row(1, None, "vitest third")], NOW)
    sustained = queue_wait_check.sustained_waits(waits, NOW)
    assert [wait.seconds for wait in sustained] == [200, 200, 60]
    assert {wait.line for wait in sustained} == {"go test first", "pytest second", "vitest third"}


def test_a_gap_of_one_minute_without_a_long_wait_passes():
    waits = queue_wait_check.queue_waits([row(5, 100, "early"), row(2, 100, "late")], NOW)
    assert queue_wait_check.sustained_waits(waits, NOW) == []


def test_short_waits_pass_however_many_there_are():
    waits = queue_wait_check.queue_waits([row(minutes, 10) for minutes in range(1, 6)], NOW)
    assert queue_wait_check.sustained_waits(waits, NOW) == []
