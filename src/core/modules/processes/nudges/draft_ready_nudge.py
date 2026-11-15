from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class DraftReadyNudge(NudgeDeclaration):
    """The nudge processes.draft_ready."""

    key = "processes.draft_ready"
    type = NudgeType.STEERING
    text = "No reader reads {name} yet; a draft fits output {output}: review and save it"
    required_command = "journal reader add {name}"
