from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationMergedNudge(NudgeDeclaration):
    """The nudge workers.operation_merged."""

    key = "workers.operation_merged"

    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = 'worker:{worker} merged: output {output}'
    turn_limited = False
    wakes_agent = True
