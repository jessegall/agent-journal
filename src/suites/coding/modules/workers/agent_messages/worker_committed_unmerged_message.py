from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerCommittedUnmergedMessage(MessageTemplate):
    """The agent message workers.committed_unmerged."""

    key = "workers.committed_unmerged"
    type = AgentMessageType.STEERING
    text = "{tasks} of worker:{worker} are committed but not merged"
    turn_limited = False
