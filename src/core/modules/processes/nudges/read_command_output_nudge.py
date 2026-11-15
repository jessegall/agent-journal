from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReadCommandOutputNudge(NudgeDeclaration):
    """The nudge processes.read_command_output."""

    key = "processes.read_command_output"
    type = NudgeType.REFUSAL
    text = "Run the read command directly, without a pipe or redirect"
