import time
from datetime import datetime, timezone

from engine.time.timestamp import Timestamp


class Clock:
    """Gives the current time and waits; tests replace it with a clock they set by hand."""

    def timestamp(self) -> Timestamp:
        return Timestamp(datetime.now(timezone.utc))

    def epoch_seconds(self) -> float:
        return self.timestamp().value.timestamp()

    def sleep(self, seconds: float) -> None:
        time.sleep(seconds)
