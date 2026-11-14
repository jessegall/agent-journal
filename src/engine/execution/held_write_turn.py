import threading

from engine.database.errors.wait_in_write_turn_error import WaitInWriteTurnError


class HeldWriteTurn(threading.local):
    """How many database write turns the current thread holds, of any kind of turn; every wait asks it first, since
    nobody waits for a slot, a child run or a sleep while every other write waits on its turn."""

    count = 0

    @property
    def is_held(self) -> bool:
        return self.count > 0

    def refuse_wait(self, subject: str) -> None:
        if self.is_held:
            raise WaitInWriteTurnError(subject)


HELD_WRITE_TURN = HeldWriteTurn()
