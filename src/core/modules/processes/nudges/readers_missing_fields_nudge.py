from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReadersMissingFieldsNudge(NudgeDeclaration):
    """The nudge processes.readers_missing_fields."""

    key = "processes.readers_missing_fields"
    type = NudgeType.STEERING
    text = "{count} readers lack required fields: draft one when an agent asks"
