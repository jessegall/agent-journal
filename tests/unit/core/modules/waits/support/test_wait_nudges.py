from core.modules.waits.nudges.wait_ended_message import WaitEndedMessage
from engine.enums.line_delivery import LineDelivery


def test_the_wait_over_nudge_uses_the_wake_hook():
    nudge = WaitEndedMessage.declared()
    assert nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK
