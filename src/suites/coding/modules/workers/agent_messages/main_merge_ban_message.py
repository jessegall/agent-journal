from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MainMergeBanMessage(MessageTemplate):
    """The agent message workers.main_merges_no_worker."""

    key = "workers.main_merges_no_worker"
    type = AgentMessageType.REFUSAL
    text = "The main agent merges no worker here: the merger or a user takes the work in"
