from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WaitDescriptionNudge(NudgeDeclaration):
    """The nudge tasks.wait_in_words."""

    key = "tasks.wait_in_words"
    type = NudgeType.STEERING
    text = "A wait is a block: on a task, a question, a plan or a command"
    interval = Interval(Seconds(1800))
