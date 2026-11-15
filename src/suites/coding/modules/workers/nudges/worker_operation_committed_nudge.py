from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerOperationCommittedNudge(NudgeDeclaration):
    """The nudge workers.operation_committed."""

    key = "workers.operation_committed"

    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = 'worker:{worker} committed its work: output {output}'
    turn_limited = False
    wakes_agent = True
