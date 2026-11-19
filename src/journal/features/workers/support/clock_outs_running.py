import contextvars
import threading
from collections.abc import Callable

from journal.features.workers.support.clock_out_run import ClockOutRun
from journal.support.rejection import Rejection


class ClockOutsRunning:
    """The workers whose clock-out runs now in this server, each on a thread of its own: a second clock-out of the same worker is refused at once while the first runs, the worker's command waits for its clock-out the seconds given, and the mark goes however the clock-out ends."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.workers: set[int] = set()

    def answered(self, worker: int, refusal: Callable[[], str], run: ClockOutRun, seconds: float) -> int | None:
        with self.lock:
            busy = worker in self.workers
            self.workers.add(worker)
        if busy:
            raise Rejection(refusal())
        threading.Thread(target=contextvars.copy_context().run, args=(self.ran, worker, run), name=f"clock-out-{worker}", daemon=True).start()
        return run.answer(seconds)

    def ran(self, worker: int, run: ClockOutRun) -> None:
        try:
            run.run()
        finally:
            with self.lock:
                self.workers.discard(worker)

    def is_running(self, worker: int) -> bool:
        with self.lock:
            return worker in self.workers
