from core.modules.waits.agent_messages.wait_ended_message import WaitEndedMessage
from engine.enums.line_delivery import LineDelivery


def test_the_wait_over_agent_message_uses_the_wake_hook():
    agent_message = WaitEndedMessage.declared()
    assert agent_message.wakes_agent and agent_message.delivery is LineDelivery.WAKE_HOOK
