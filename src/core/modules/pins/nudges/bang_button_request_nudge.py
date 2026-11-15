from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class BangButtonRequestNudge(NudgeDeclaration):
    """The nudge pins.pin_the_bang_command."""

    key = "pins.pin_the_bang_command"
    type = NudgeType.STEERING
    text = "A pin can hold a button that runs your ! command in your terminal"
    interval = Interval(Seconds(300))
