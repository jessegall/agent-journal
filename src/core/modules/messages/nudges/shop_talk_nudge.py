from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class ShopTalkNudge(NudgeDeclaration):
    """The nudge messages.no_shop_talk."""

    key = "messages.no_shop_talk"
    type = NudgeType.STEERING
    text = "Talk about the work, not the journal's commands"
    interval = Interval(Seconds(600))
