from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ProjectHookWakeMessage(MessageTemplate):
    """The agent message drivers.project_hook_woke."""

    key = "drivers.project_hook_woke"
    type = AgentMessageType.NOTICE
    text = "project hook {hook} woke you: {text}"
    turn_limited = False
    wakes_agent = True
    delivery = LineDelivery.WAKE_HOOK
    full_text = True
