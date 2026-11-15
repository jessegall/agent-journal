from core.modules.waits.nudges.wait_ended_nudge import WaitEndedNudge
from engine.enums.line_delivery import LineDelivery


def test_the_wait_over_nudge_uses_the_wake_hook():
    nudge = WaitEndedNudge.declared()
    assert nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK
