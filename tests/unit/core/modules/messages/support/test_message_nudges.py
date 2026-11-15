from core.modules.developer.nudges.exception_line_message import ExceptionLineMessage
from core.modules.messages.support import message_nudges
from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate


def test_message_nudges_that_wake_an_agent_use_the_wake_hook():
    declared = [value.declared() for value in vars(message_nudges).values() if isinstance(value, type) and issubclass(value, MessageTemplate) and value is not MessageTemplate]
    waking = [nudge for nudge in declared if nudge.wakes_agent]
    assert waking and all(nudge.delivery is LineDelivery.WAKE_HOOK for nudge in [*waking, ExceptionLineMessage.declared()])
