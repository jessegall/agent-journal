from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationStartedNudge(NudgeDeclaration):
    """The nudge workers.operation_started."""

    key = "workers.operation_started"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = 'worker:{worker} started its next task: output {output}'
    turn_limited = False
    wakes_agent = True
