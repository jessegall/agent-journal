from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PanicFileNudge(NudgeDeclaration):
    """The nudge drivers.panic_file."""

    key = "drivers.panic_file"
    type = NudgeType.SAFETY_REFUSAL
    text = "The panic file is only for a journal that does not answer: it answers you, so report what is wrong instead"
