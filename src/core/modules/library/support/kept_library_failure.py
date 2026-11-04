import json

from core.base.clock import Clock
from core.base.journal_home import JournalHome
from core.base.timestamp import Timestamp

KEPT_SECONDS = 60


class KeptLibraryFailure:
    """A failure of the shared server remembered in a file for a minute, so ten searches on a dead network wait for
    the server once, not ten times."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home, self.clock = home, clock

    def is_kept(self) -> bool:
        try:
            age = (self.clock.timestamp().value - Timestamp.parsed(str(json.loads(self.home.library_failure_file.read_text())["at"])).value).total_seconds()
        except (OSError, ValueError, KeyError):
            return False
        return 0 <= age < KEPT_SECONDS

    def keep(self, reason: str) -> None:
        self.home.library_failure_file.parent.mkdir(parents=True, exist_ok=True)
        self.home.library_failure_file.write_text(json.dumps({"reason": reason, "at": self.clock.timestamp().text}))
