from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationUpdatedNudge(NudgeDeclaration):
    """The nudge workers.operation_updated."""

    key = "workers.operation_updated"

    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = 'worker:{worker} is up to date: output {output}'
    turn_limited = False
    wakes_agent = True
