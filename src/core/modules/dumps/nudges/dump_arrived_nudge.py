from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class DumpArrivedNudge(NudgeDeclaration):
    """The nudge dumps.dump_arrived."""

    key = "dumps.dump_arrived"
    type = NudgeType.STEERING
    text = "dump:{dump} arrived: read it and file it"
