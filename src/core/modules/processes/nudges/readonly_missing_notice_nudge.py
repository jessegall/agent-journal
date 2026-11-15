from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReadonlyMissingNoticeNudge(NudgeDeclaration):
    """The nudge processes.read_only_missing_readers."""

    key = "processes.read_only_missing_readers"
    type = NudgeType.STEERING
    text = "{count} commands run by read-only helpers have no proper reader"
