from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from suites.coding.modules.workers.support import worker_nudges


def test_every_worker_operation_nudge_that_wakes_an_agent_uses_the_wake_hook():
    declared = [value.declared() for name, value in vars(worker_nudges).items()
                if name.startswith("WorkerOperation") and isinstance(value, type) and issubclass(value, NudgeDeclaration)]
    waking = [nudge for nudge in declared if nudge.wakes_agent]
    assert len(waking) == 11 and all(nudge.delivery is LineDelivery.WAKE_HOOK for nudge in waking)
