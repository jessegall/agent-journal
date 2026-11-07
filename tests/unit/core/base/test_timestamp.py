from datetime import datetime, timedelta, timezone

import pytest

from core.base.clock import Clock
from core.base.timestamp import Timestamp

AMSTERDAM = timezone(timedelta(hours=1))


def test_a_naive_time_is_refused():
    with pytest.raises(ValueError, match="naive"):
        Timestamp(datetime(2026, 10, 31, 9, 30))


def test_a_timestamp_reads_back_from_its_text_the_same_in_utc():
    timestamp = Timestamp(datetime(2026, 10, 31, 9, 30, 0, 5, tzinfo=AMSTERDAM))
    assert timestamp.text == "2026-10-31T08:30:00.000005+00:00"
    assert Timestamp.parsed(timestamp.text) == timestamp


def test_timestamps_sort_as_text_as_they_do_as_times():
    timestamps = [Timestamp(datetime(2026, 10, 31, 9, 30, second, tzinfo=timezone.utc)) for second in (5, 0, 59)]
    assert sorted(timestamp.text for timestamp in timestamps) == [timestamp.text for timestamp in sorted(timestamps)]


def test_a_clock_can_be_replaced_by_one_that_is_moved_by_hand():
    fixed = Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc))

    class FixedClock(Clock):
        def timestamp(self) -> Timestamp:
            return fixed

    assert FixedClock().timestamp() == fixed
    assert Clock().timestamp().value.tzinfo is not None
