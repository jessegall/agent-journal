from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class DumpOpenNudge(NudgeDeclaration):
    """The nudge dumps.dump_open."""

    key = "dumps.dump_open"
    type = NudgeType.STEERING
    text = "dump {dump} is not filed yet: file it"
    interval = Interval(Seconds(900))
