from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SandboxParseErrorNudge(NudgeDeclaration):
    """The nudge processes.sandbox_parse_error."""

    key = "processes.sandbox_parse_error"
    type = NudgeType.REFUSAL
    text = "The read-only sandbox cannot run an unparsed line: split it into simpler commands"
