from datetime import datetime, timedelta, timezone
from unittest.mock import Mock

from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.span import Span
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp


def test_each_start_uses_the_first_span_that_passes():
    checked_at = Timestamp(datetime(2026, 11, 5, 12, tzinfo=timezone.utc))
    starts = [Timestamp(checked_at.value - timedelta(seconds=seconds)) for seconds in (3600, 1800, 60)]
    queries = Mock(spec=Queries)
    counted = Mock(spec=Span)
    counted.has_passed_many.return_value = [True, False]
    interval = Interval(Seconds(3600), counted)

    assert interval.has_passed_many(queries, 7, starts, checked_at) == [True, True, False]
    counted.has_passed_many.assert_called_once_with(queries, 7, starts[1:], checked_at)


def test_no_later_span_is_read_once_every_start_has_passed():
    checked_at = Timestamp(datetime(2026, 11, 5, 12, tzinfo=timezone.utc))
    starts = [Timestamp(checked_at.value - timedelta(hours=1))]
    queries = Mock(spec=Queries)
    counted = Mock(spec=Span)

    assert Interval(Seconds(3600), counted).has_passed_many(queries, 7, starts, checked_at) == [True]
    counted.has_passed_many.assert_not_called()
