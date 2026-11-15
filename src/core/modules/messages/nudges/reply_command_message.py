from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class ReplyCommandMessage(MessageTemplate):
    """The nudge messages.reply_command."""

    key = "messages.reply_command"
    type = AgentMessageType.STEERING
    text = "Your chat words are your reply: in a turn that continues, reply first"
    interval = Interval(Seconds(1800))
