from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MonitorToolRequiredNudge(NudgeDeclaration):
    """The nudge processes.monitor_command_outside."""

    key = "processes.monitor_command_outside"
    type = NudgeType.REFUSAL
    text = "The output wait only runs in a Monitor: give it to the Monitor tool and keep working"
