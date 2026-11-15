from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class ShopTalkMessage(MessageTemplate):
    """The nudge messages.no_shop_talk."""

    key = "messages.no_shop_talk"
    type = AgentMessageType.STEERING
    text = "Talk about the work, not the journal's commands"
    interval = Interval(Seconds(600))
