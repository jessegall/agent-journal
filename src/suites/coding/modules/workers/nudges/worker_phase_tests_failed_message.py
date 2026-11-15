from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerPhaseTestsFailedMessage(MessageTemplate):
    """The nudge workers.phase_tests_failed."""

    key = "workers.phase_tests_failed"
    type = AgentMessageType.STEERING
    text = 'phase:{phase} tests failed, output {outputs}: {line} Failed: {failed}'
    turn_limited = False
    id_field = "outputs"
    path_fields = ["line"]
