from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from suites.coding.modules.workers.support import worker_nudges


def test_eleven_worker_operation_nudges_wake_an_agent_through_the_wake_hook():
    declared = [value.declared() for name, value in vars(worker_nudges).items()
                if name.startswith("WorkerOperation") and isinstance(value, type) and issubclass(value, MessageTemplate)]
    by_wake_hook = [nudge for nudge in declared if nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK]
    assert len(by_wake_hook) == 11 and all(nudge.wakes_agent for nudge in declared)
