from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CompactionNoticeNudge(NudgeDeclaration):
    """The nudge drivers.compaction_notice."""

    key = "drivers.compaction_notice"
    type = NudgeType.STEERING
    text = "agent:{agent} posted context-compaction-notice:{notice}"
    turn_limited = False
    wakes_agent = True
