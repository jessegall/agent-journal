from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WaitDescriptionMessage(MessageTemplate):
    """The agent message tasks.wait_in_words."""

    key = "tasks.wait_in_words"
    type = AgentMessageType.STEERING
    text = "A wait is a block: on a task, a question, a plan or a command"
    interval = Interval(Seconds(1800))
