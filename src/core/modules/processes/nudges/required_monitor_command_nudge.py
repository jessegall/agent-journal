from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RequiredMonitorCommandNudge(NudgeDeclaration):
    """The nudge processes.monitor_command_required."""

    key = "processes.monitor_command_required"
    type = NudgeType.REFUSAL
    text = "Output {output} is still running: wait for it before you stop"
