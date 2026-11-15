from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnfinishedMergeMessage(MessageTemplate):
    """The agent message workers.unfinished-merge: a merger's stop is refused while a merge it started still runs."""

    key = "workers.unfinished-merge"
    type = AgentMessageType.STEERING
    text = "Your merge of worker {worker} is still running: wait for it to end, then stop"
