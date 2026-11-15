from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergerLineAvailableMessage(MessageTemplate):
    """The nudge workers.merger_line_available."""

    key = "workers.merger_line_available"
    type = AgentMessageType.STEERING
    text = "merger-line:{line}"
    turn_limited = False
    wakes_agent = True
    id_field = "line"
    plural_text = "merger-lines {line}"
