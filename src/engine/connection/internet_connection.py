from functools import lru_cache
from threading import RLock

from engine.connection.connection_probe import ConnectionProbe
from engine.enums.connection_status import ConnectionStatus
from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp

CHECK_INTERVAL_SECONDS = 10


class InternetConnection:
    """The latest connection result shared by a journal's ticks and viewer."""

    def __init__(self) -> None:
        self.status = ConnectionStatus.UNKNOWN
        self.checked_at: Timestamp | None = None
        self.reconnected_at: Timestamp | None = None
        self.lock = RLock()

    @staticmethod
    @lru_cache(maxsize=128)
    def shared(home: JournalHome) -> "InternetConnection":
        return InternetConnection()

    def check(self, probe: ConnectionProbe, timestamp: Timestamp) -> None:
        with self.lock:
            if self.checked_at is not None and 0 <= self.checked_at.elapsed_seconds(timestamp) < CHECK_INTERVAL_SECONDS:
                return
            status = ConnectionStatus.ONLINE if probe.is_online() else ConnectionStatus.OFFLINE
            if self.status is ConnectionStatus.OFFLINE and status is ConnectionStatus.ONLINE:
                self.reconnected_at = timestamp
            self.status, self.checked_at = status, timestamp
