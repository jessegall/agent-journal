import threading
import time
from datetime import datetime, timezone

from core.modules.drivers.models.enums.wake_outcome import WakeOutcome
from core.modules.drivers.support.wake_waiters import WakeWaiters
from engine.time.timestamp import Timestamp

GIVEN_AT = Timestamp(datetime(2026, 11, 15, 9, tzinfo=timezone.utc))


def test_a_second_waiter_cancels_the_first():
    waiters = WakeWaiters()
    first = waiters.register(3, "first")
    second = waiters.register(3, "second")
    assert waiters.wait(first, 0).outcome is WakeOutcome.CANCELLED
    assert second.is_live and waiters.has_waiter(3)


def test_an_offer_wakes_the_waiting_thread():
    waiters = WakeWaiters()
    waiter = waiters.register(3, "token")
    outcomes: list[WakeOutcome] = []
    thread = threading.Thread(target=lambda: outcomes.append(waiters.wait(waiter, 5).outcome))
    thread.start()
    time.sleep(0.05)
    assert waiters.offer(3, "[journal] go on", 7, GIVEN_AT)
    thread.join(1)
    assert outcomes == [WakeOutcome.GIVEN] and (waiter.text, waiter.line_id) == ("[journal] go on", 7)
    assert not waiters.has_waiter(3)


def test_a_wait_with_no_offer_returns_nothing_after_its_time():
    waiters = WakeWaiters()
    started = time.monotonic()
    assert waiters.wait(waiters.register(3, "token"), 0.05).outcome is WakeOutcome.NOTHING
    assert time.monotonic() - started >= 0.05 and waiters.has_waiter(3)


def test_an_offer_with_no_waiter_is_refused():
    assert not WakeWaiters().offer(3, "[journal] go on", 7, GIVEN_AT)


def test_cancel_wakes_the_wait_with_cancelled():
    waiters = WakeWaiters()
    waiter = waiters.register(3, "token")
    outcomes: list[WakeOutcome] = []
    thread = threading.Thread(target=lambda: outcomes.append(waiters.wait(waiter, 5).outcome))
    thread.start()
    time.sleep(0.05)
    waiters.cancel(3)
    thread.join(1)
    assert outcomes == [WakeOutcome.CANCELLED] and not waiters.has_waiter(3)


def test_the_same_token_asking_again_keeps_its_waiter():
    waiters = WakeWaiters()
    assert waiters.register(3, "token") is waiters.register(3, "token")
