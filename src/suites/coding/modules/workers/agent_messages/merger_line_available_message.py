from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergerLineAvailableMessage(MessageTemplate):
    """The agent message workers.merger_line_available: a line about a worker, often a worker's question it waits
    on, that the merger or, with the merger off, the main agent must read and answer."""

    key = "workers.merger_line_available"
    type = AgentMessageType.STEERING
    text = "merger-line:{line} waits for you: read it with journal merger-line show {line} and act on it; a worker that asked waits for your answer"
    turn_limited = False
    wakes_agent = True
    id_field = "line"
    plural_text = "merger-lines {line} wait for you: read each with journal merger-line show and act on it; a worker that asked waits for your answer"
