from datetime import datetime, timezone

import pytest

from core.base.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.triggers.commands.support.cron_line import CronLine

MONDAY_START = Timestamp(datetime(2026, 11, 2, 8, 30, tzinfo=timezone.utc))


def test_minute_fits_fields():
    assert CronLine("0 9 * * 1").next_after(MONDAY_START).value == datetime(2026, 11, 2, 9, 0, tzinfo=timezone.utc)
    assert CronLine("*/15 * * * *").next_after(MONDAY_START).value == datetime(2026, 11, 2, 8, 45, tzinfo=timezone.utc)


def test_weekday_waits():
    assert CronLine("0 9 * * 3").next_after(MONDAY_START).value == datetime(2026, 11, 4, 9, 0, tzinfo=timezone.utc)


def test_short_line_refused():
    with pytest.raises(Refusal):
        CronLine("0 9 *")
