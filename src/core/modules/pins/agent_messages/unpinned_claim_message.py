from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class UnpinnedClaimMessage(MessageTemplate):
    """The nudge pins.pin_claimed_unmade."""

    key = "pins.pin_claimed_unmade"
    type = AgentMessageType.STEERING
    text = "You mentioned a pinned link but made none: pin it or drop the mention"
    interval = Interval(Seconds(300))
