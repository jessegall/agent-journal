from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerForeignLinkMessage(MessageTemplate):
    """The agent message workers.outside_link."""

    key = "workers.outside_link"
    type = AgentMessageType.REFUSAL
    text = "Links from outside your worktree are refused: report what is missing to your main agent"
    turn_limited = False
