from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RequiredCommandRefusalNudge(NudgeDeclaration):
    """The nudge drivers.required_command_refusal."""

    key = "drivers.required_command_refusal"
    type = NudgeType.REFUSAL
    text = "{subject} is due: do it now, or skip block {block} with a reason"
