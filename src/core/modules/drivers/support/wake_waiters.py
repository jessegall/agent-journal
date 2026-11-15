import threading
from functools import cache

from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.enums.wake_outcome import WakeOutcome
from core.modules.drivers.support.given_wake_line import GivenWakeLine
from core.modules.drivers.support.wake_waiter import WakeWaiter


class WakeWaiters:
    """The wake waiters of the server process, one per agent, and the lines given to them and not yet confirmed. A new
    waiter of an agent cancels the one before it. A wait blocks only on this object's lock, never on the database."""

    def __init__(self) -> None:
        self.changed = threading.Condition()
        self.waiters: dict[int, WakeWaiter] = {}
        self.given: dict[int, GivenWakeLine] = {}

    # one set of waiters for each journal a server process serves, shared by every request thread
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "WakeWaiters":
        return WakeWaiters()

    def register(self, agent_id: int, token: str) -> WakeWaiter:
        with self.changed:
            current = self.waiters.get(agent_id)
            # the same waiter asking again keeps its wait, and a line given to it between two of its asks
            if current is not None and current.token == token and current.outcome is not WakeOutcome.CANCELLED:
                return current
            if current is not None and current.is_live:
                current.outcome = WakeOutcome.CANCELLED
            waiter = WakeWaiter(agent_id, token)
            self.waiters[agent_id] = waiter
            self.changed.notify_all()
            return waiter

    def wait(self, waiter: WakeWaiter, seconds: float) -> WakeWaiter:
        with self.changed:
            self.changed.wait_for(lambda: not waiter.is_live, timeout=seconds)
            if not waiter.is_live and self.waiters.get(waiter.agent_id) is waiter:
                del self.waiters[waiter.agent_id]
            return waiter

    def offer(self, agent_id: int, text: str, line_id: int, given_at: Timestamp) -> bool:
        with self.changed:
            waiter = self.waiters.get(agent_id)
            if waiter is None or not waiter.is_live:
                return False
            waiter.outcome, waiter.text, waiter.line_id = WakeOutcome.GIVEN, text, line_id
            self.given[line_id] = GivenWakeLine(waiter.token, given_at)
            self.changed.notify_all()
            return True

    def cancel(self, agent_id: int) -> None:
        with self.changed:
            waiter = self.waiters.pop(agent_id, None)
            if waiter is not None and waiter.is_live:
                waiter.outcome = WakeOutcome.CANCELLED
            self.changed.notify_all()

    def waiter(self, agent_id: int, token: str) -> WakeWaiter | None:
        with self.changed:
            waiter = self.waiters.get(agent_id)
            return waiter if waiter is not None and waiter.token == token else None

    def live_count(self) -> int:
        with self.changed:
            return sum(1 for waiter in self.waiters.values() if waiter.is_live)

    def has_waiter(self, agent_id: int) -> bool:
        with self.changed:
            waiter = self.waiters.get(agent_id)
            return waiter is not None and waiter.is_live

    def confirmed(self, line_id: int, token: str) -> bool:
        with self.changed:
            given = self.given.get(line_id)
            if given is None or given.token != token:
                return False
            del self.given[line_id]
            return True

    def unconfirmed(self, given_before: Timestamp) -> list[int]:
        with self.changed:
            late = [line_id for line_id, given in self.given.items() if given.given_at.value < given_before.value]
            for line_id in late:
                del self.given[line_id]
            return late
