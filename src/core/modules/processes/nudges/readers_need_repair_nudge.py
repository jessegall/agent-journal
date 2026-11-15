from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReadersNeedRepairNudge(NudgeDeclaration):
    """The nudge processes.readers_need_repair."""

    key = "processes.readers_need_repair"
    type = NudgeType.STEERING
    text = "Reader {reader} matched nothing in its last {count} outputs: repair it"
    plural_text = "readers {reader} picked no line of their last {count} outputs: repair them"
