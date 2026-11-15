from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerRouteFallbackMessage(MessageTemplate):
    """The nudge workers.route_fallback."""

    key = "workers.route_fallback"
    type = AgentMessageType.STEERING
    text = "Route {route}: {tasks} went to {program}"
    turn_limited = False
