from datetime import datetime, timezone

from core.base.timestamp import Timestamp


class Clock:
    """Gives the current time; tests replace it with a clock they set by hand."""

    def timestamp(self) -> Timestamp:
        return Timestamp(datetime.now(timezone.utc))
