from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HooksUncheckedNudge(NudgeDeclaration):
    """The nudge drivers.hooks_unchecked."""

    key = "drivers.hooks_unchecked"
    type = NudgeType.STEERING
    text = "{count} of your hooks ran unchecked while the journal was not answering: review what you ran then"
