from engine.file.file_access import FileAccess
import json

from engine.time.clock import Clock
from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp

KEPT_SECONDS = 60


class KeptLibraryFailure:
    """A failure of the shared server remembered in a file for a minute, so ten searches on a dead network wait for
    the server once, not ten times."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.home, self.clock = home, clock

    def is_kept(self) -> bool:
        try:
            age = (self.clock.timestamp().value - Timestamp.parsed(str(json.loads(FileAccess.shared().read(self.home.library_failure_file))["at"])).value).total_seconds()
        except (OSError, ValueError, KeyError):
            return False
        return 0 <= age < KEPT_SECONDS

    def keep(self, reason: str) -> None:
        self.home.library_failure_file.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.home.library_failure_file, json.dumps({"reason": reason, "at": self.clock.timestamp().text}))
