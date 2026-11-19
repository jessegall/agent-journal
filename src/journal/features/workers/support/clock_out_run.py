import threading
from collections.abc import Callable


class ClockOutRun:
    """One worker's clock-out on a thread of its own: its command waits for it the seconds it may and is answered by its code or its refusal; once the command has stopped waiting, the clock-out is marked as going on by itself, and a refusal it ends on is handed on instead."""

    def __init__(self, clock_out: Callable[[], int], continued: Callable[[], None], refused: Callable[[str], None]) -> None:
        self.clock_out, self.continued, self.refused = clock_out, continued, refused
        self.lock, self.ended = threading.Lock(), threading.Event()
        self.is_left, self.code, self.error = False, 0, None

    def run(self) -> None:
        try:
            self.code = self.clock_out()
        except Exception as error:
            self.error = error
        with self.lock:
            self.ended.set()
            is_left = self.is_left
        if is_left and self.error is not None:
            self.refused(str(self.error))

    def answer(self, seconds: float) -> int | None:
        """The clock-out's code once it ended within the seconds, its refusal raised; None once it goes on by itself."""
        self.ended.wait(seconds)
        with self.lock:
            if not self.ended.is_set():
                self.is_left = True
                self.continued()
                return None
        if self.error is not None:
            raise self.error
        return self.code
