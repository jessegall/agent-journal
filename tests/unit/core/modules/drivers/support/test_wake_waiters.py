from datetime import datetime, timezone

from core.modules.drivers.models.enums.wake_outcome import WakeOutcome
from core.modules.drivers.support.wake_waiters import WakeWaiters
from engine.time.timestamp import Timestamp

GIVEN_AT = Timestamp(datetime(2026, 11, 15, 9, tzinfo=timezone.utc))


def test_a_second_waiter_cancels_the_first():
    waiters = WakeWaiters()
    first = waiters.register(3, "first")
    second = waiters.register(3, "second")
    assert waiters.forget_ended(first).outcome is WakeOutcome.CANCELLED
    assert second.is_live and waiters.has_waiter(3)


def test_an_offer_gives_the_waiter_its_line_and_the_ended_waiter_is_forgotten():
    waiters = WakeWaiters()
    waiter = waiters.register(3, "token")
    assert waiters.offer(3, "[journal] go on", 7, GIVEN_AT)
    assert waiters.forget_ended(waiter).outcome is WakeOutcome.GIVEN and (waiter.text, waiter.line_id) == ("[journal] go on", 7)
    assert not waiters.has_waiter(3) and waiters.waiter(3, "token") is None


def test_a_waiter_with_no_offer_stays_live_and_kept():
    waiters = WakeWaiters()
    assert waiters.forget_ended(waiters.register(3, "token")).outcome is WakeOutcome.NOTHING
    assert waiters.has_waiter(3)


def test_an_offer_with_no_waiter_is_refused():
    assert not WakeWaiters().offer(3, "[journal] go on", 7, GIVEN_AT)


def test_cancel_ends_the_waiter_with_cancelled():
    waiters = WakeWaiters()
    waiter = waiters.register(3, "token")
    waiters.cancel(3)
    assert waiter.outcome is WakeOutcome.CANCELLED and not waiters.has_waiter(3)


def test_the_same_token_asking_again_keeps_its_waiter():
    waiters = WakeWaiters()
    assert waiters.register(3, "token") is waiters.register(3, "token")


def test_a_line_given_between_two_asks_reaches_the_next_ask():
    waiters = WakeWaiters()
    waiter = waiters.register(3, "token")
    waiters.offer(3, "[journal] go on", 7, GIVEN_AT)
    again = waiters.register(3, "token")
    assert again is waiter and waiters.forget_ended(again).outcome is WakeOutcome.GIVEN
