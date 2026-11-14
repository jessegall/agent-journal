from core.modules.waits.support.wait_nudges import WAIT_ENDED
from engine.driver.line_delivery import LineDelivery


def test_the_wait_over_nudge_uses_the_wake_hook():
    assert WAIT_ENDED.wakes_agent and WAIT_ENDED.delivery is LineDelivery.WAKE_HOOK
