from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from suites.coding.modules.workers.support import worker_agent_messages


def test_eleven_worker_operation_agent_messages_wake_an_agent_through_the_wake_hook():
    declared = [value.declared() for name, value in vars(worker_agent_messages).items()
                if name.startswith("WorkerOperation") and isinstance(value, type) and issubclass(value, MessageTemplate)]
    by_wake_hook = [agent_message for agent_message in declared if agent_message.wakes_agent and agent_message.delivery is LineDelivery.WAKE_HOOK]
    assert len(by_wake_hook) == 11 and all(agent_message.wakes_agent for agent_message in declared)
