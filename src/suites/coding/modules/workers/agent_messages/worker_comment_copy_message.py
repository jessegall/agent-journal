from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerCommentCopyMessage(MessageTemplate):
    """The nudge workers.comment_copy."""

    key = "workers.comment_copy"
    type = AgentMessageType.STEERING
    text = "worker:{worker} also got message:{message}: act on it yourself, or leave it to the worker"
    turn_limited = False
    wakes_agent = True
