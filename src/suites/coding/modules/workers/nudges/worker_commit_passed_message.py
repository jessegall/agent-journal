from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerCommitPassedMessage(MessageTemplate):
    """The nudge workers.commit_tests_passed."""

    key = "workers.commit_tests_passed"
    type = AgentMessageType.STEERING
    text = "Your commit's tests passed: {line}"
    turn_limited = False
    path_fields = ["line"]
