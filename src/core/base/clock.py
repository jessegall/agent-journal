from datetime import datetime, timezone

from core.base.moment import Moment


class Clock:
    """The one source of the time; stories replace it with one they move by hand."""

    def moment(self) -> Moment:
        return Moment(datetime.now(timezone.utc))
