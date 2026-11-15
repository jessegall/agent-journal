from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergerPassedMessage(MessageTemplate):
    """The nudge workers.merger_passed."""

    key = "workers.merger_passed"
    type = AgentMessageType.STEERING
    text = "The merger passed worker:{worker} to you: its merge waits on you"
    plural_text = "the merger leaves workers {worker} to you: their merges wait on you"
    id_field = "worker"
    wakes_agent = True
