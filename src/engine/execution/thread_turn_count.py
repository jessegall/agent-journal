import threading

from engine.database.errors.wait_during_write_turn_error import WaitDuringWriteTurnError


class ThreadTurnCount(threading.local):
    """How many database write turns the current thread holds, of any kind of turn; every wait asks it first, since
    nobody waits for a slot, a child run or a sleep while every other write waits on its turn."""

    count = 0

    @property
    def has_turn(self) -> bool:
        return self.count > 0

    def refuse_wait(self, subject: str) -> None:
        if self.has_turn:
            raise WaitDuringWriteTurnError(subject)


THREAD_TURN_COUNT = ThreadTurnCount()
