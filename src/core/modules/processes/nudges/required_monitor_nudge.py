from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RequiredMonitorNudge(NudgeDeclaration):
    """The nudge processes.monitor_required."""

    key = "processes.monitor_required"
    type = NudgeType.REFUSAL
    text = "Output {output} is still running: set a Monitor on its wait before you stop"
