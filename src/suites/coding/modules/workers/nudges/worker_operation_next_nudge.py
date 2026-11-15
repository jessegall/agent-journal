from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationNextNudge(NudgeDeclaration):
    """The nudge workers.operation_next."""

    key = "workers.operation_next"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = 'task:{task} is yours next; output {output}'
    turn_limited = False
    wakes_agent = True
