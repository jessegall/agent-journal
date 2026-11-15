from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTestsPassedMessage(MessageTemplate):
    """The agent message workers.tests_passed."""

    key = "workers.tests_passed"
    type = AgentMessageType.STEERING
    text = "All tests of worker:{worker} pass"
    turn_limited = False
    plural_text = 'the tests of workers {worker} all pass'
    id_field = "worker"
