from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderDraftNudge(NudgeDeclaration):
    """The nudge processes.draft_a_reader."""

    key = "processes.draft_a_reader"
    type = NudgeType.STEERING
    text = "No reader reads {name} yet: draft one"
    required_command = "journal reader add {name}"
