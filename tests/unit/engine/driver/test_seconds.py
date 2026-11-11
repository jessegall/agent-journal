from datetime import datetime, timedelta, timezone

from engine.driver.seconds import Seconds
from engine.time.timestamp import Timestamp

MOMENT = Timestamp(datetime(2026, 11, 9, 12, tzinfo=timezone.utc))


def test_the_span_has_elapsed_once_its_seconds_have_gone_by():
    start = Timestamp(MOMENT.value - timedelta(seconds=60))

    assert Seconds(60).has_elapsed(start, MOMENT)
    assert not Seconds(61).has_elapsed(start, MOMENT)


def test_the_moment_before_is_the_span_back_from_a_timestamp():
    assert Seconds.minutes(2).subtracted_from(MOMENT) == Timestamp(MOMENT.value - timedelta(minutes=2))
