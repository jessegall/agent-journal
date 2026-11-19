import threading
from collections.abc import Callable
from functools import cache

from engine.journal.journal_home import JournalHome

MEASURE_CHECK_SECONDS = 1.0


class MeasureAnswer:
    """Whether costs may be measured now, kept for a second for each journal a process serves, since a state is
    made for every request."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.kept: tuple[float, bool] | None = None

    @staticmethod
    @cache
    def shared(home: JournalHome) -> "MeasureAnswer":
        return MeasureAnswer()

    def answer(self, now: float, measured: Callable[[], bool]) -> bool:
        with self.lock:
            if self.kept is None or now - self.kept[0] >= MEASURE_CHECK_SECONDS:
                self.kept = (now, measured())
            return self.kept[1]

    def forget(self) -> None:
        with self.lock:
            self.kept = None
