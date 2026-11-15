from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CacheKeepaliveMessage(MessageTemplate):
    """The nudge drivers.cache_keepalive."""

    key = "drivers.cache_keepalive"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "Cache keep-alive only, no work asked: stop again right away"
    turn_limited = False
    wakes_agent = True
