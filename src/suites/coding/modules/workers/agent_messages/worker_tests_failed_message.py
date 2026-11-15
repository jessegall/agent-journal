from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTestsFailedMessage(MessageTemplate):
    """The agent message workers.tests_failed."""

    key = "workers.tests_failed"
    type = AgentMessageType.STEERING
    text = "Your tests failed, output {outputs}: {line}"
    turn_limited = False
    path_fields = ["line"]
