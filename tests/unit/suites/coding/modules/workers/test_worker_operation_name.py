from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from suites.coding.modules.workers.models.enums import worker_operation_name


def test_every_worker_operation_nudge_uses_the_wake_hook():
    declared = [value for value in vars(worker_operation_name).values() if isinstance(value, NudgeDeclaration)]
    assert len(declared) == 11 and all(nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK for nudge in declared)
