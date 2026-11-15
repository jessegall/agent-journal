from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class AliasSuggestionNudge(NudgeDeclaration):
    """The nudge processes.alias_suggestion."""

    key = "processes.alias_suggestion"
    type = NudgeType.STEERING
    text = "You ran {shape} {count} times: save it as an alias"
    interval = Interval(Seconds(3600))
