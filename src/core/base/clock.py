from datetime import datetime, timezone

from core.base.moment import Moment


class Clock:
    """Tells the current time; tests swap it for a clock they set by hand."""

    def moment(self) -> Moment:
        return Moment(datetime.now(timezone.utc))
