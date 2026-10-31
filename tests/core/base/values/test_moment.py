from datetime import datetime, timedelta, timezone

import pytest

from core.base.clock import Clock
from core.base.moment import Moment

AMSTERDAM = timezone(timedelta(hours=1))


def test_a_naive_time_is_refused():
    with pytest.raises(ValueError, match="naive"):
        Moment(datetime(2026, 10, 31, 9, 30))


def test_a_moment_reads_back_from_its_text_the_same_in_utc():
    moment = Moment(datetime(2026, 10, 31, 9, 30, 0, 5, tzinfo=AMSTERDAM))
    assert moment.text == "2026-10-31T08:30:00.000005+00:00"
    assert Moment.parsed(moment.text) == moment


def test_moments_sort_as_text_as_they_do_as_times():
    moments = [Moment(datetime(2026, 10, 31, 9, 30, second, tzinfo=timezone.utc)) for second in (5, 0, 59)]
    assert sorted(moment.text for moment in moments) == [moment.text for moment in sorted(moments)]


def test_a_clock_can_be_replaced_by_one_that_is_moved_by_hand():
    fixed = Moment(datetime(2026, 10, 31, tzinfo=timezone.utc))

    class FixedClock(Clock):
        def moment(self) -> Moment:
            return fixed

    assert FixedClock().moment() == fixed
    assert Clock().moment().value.tzinfo is not None
