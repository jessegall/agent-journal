from datetime import datetime, timedelta, timezone

import pytest

from engine.time.duration import Duration
from engine.errors.duration_error import DurationError
from engine.time.timestamp import Timestamp


@pytest.mark.parametrize("text, seconds", [("30", 30), ("30s", 30), ("5m", 300), ("2h", 7200), ("1d", 86400), (" 2M ", 120)])
def test_a_duration_reads_its_unit(text, seconds):
    assert Duration.parse(text).seconds == seconds


@pytest.mark.parametrize("text", ["", "0", "0s", "-5m", "1.5h", "later", "2weeks"])
def test_an_invalid_duration_is_refused(text):
    with pytest.raises(DurationError):
        Duration.parse(text)


def test_a_duration_passes_at_its_exact_limit():
    start = Timestamp(datetime(2026, 11, 4, tzinfo=timezone.utc))
    duration = Duration.parse("1m")
    assert not duration.has_passed(start, Timestamp(start.value + timedelta(seconds=59)))
    assert duration.has_passed(start, Timestamp(start.value + timedelta(seconds=60)))
