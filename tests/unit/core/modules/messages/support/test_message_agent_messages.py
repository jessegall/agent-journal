from core.modules.developer.agent_messages.exception_line_message import ExceptionLineMessage
from core.modules.messages.support import message_agent_messages
from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate


def test_message_agent_messages_that_wake_an_agent_use_the_wake_hook():
    declared = [value.declared() for value in vars(message_agent_messages).values() if isinstance(value, type) and issubclass(value, MessageTemplate) and value is not MessageTemplate]
    waking = [agent_message for agent_message in declared if agent_message.wakes_agent]
    assert waking and all(agent_message.delivery is LineDelivery.WAKE_HOOK for agent_message in [*waking, ExceptionLineMessage.declared()])
