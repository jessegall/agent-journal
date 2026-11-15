from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class EmDashNudge(NudgeDeclaration):
    """The nudge messages.no_em_dashes."""

    key = "messages.no_em_dashes"
    type = NudgeType.STEERING
    text = "No em dashes in the chat: use a full stop"
    interval = Interval(Seconds(600))
