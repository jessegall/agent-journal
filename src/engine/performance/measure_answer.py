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
        self.forgotten_count = 0

    @staticmethod
    @cache
    def shared(home: JournalHome) -> "MeasureAnswer":
        return MeasureAnswer()

    # the marks are read outside the lock, so no thread waits on another's file calls; an answer read across a
    # forget is not kept
    def answer(self, now: float, measured: Callable[[], bool]) -> bool:
        with self.lock:
            kept, forgotten_count = self.kept, self.forgotten_count
        if kept is not None and now - kept[0] < MEASURE_CHECK_SECONDS:
            return kept[1]
        answer = measured()
        with self.lock:
            if self.forgotten_count == forgotten_count:
                self.kept = (now, answer)
        return answer

    def forget(self) -> None:
        with self.lock:
            self.kept = None
            self.forgotten_count += 1
