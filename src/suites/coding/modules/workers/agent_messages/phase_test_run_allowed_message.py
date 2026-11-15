from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PhaseTestRunAllowedMessage(MessageTemplate):
    """The agent message workers.phase_test_run_allowed."""

    key = "workers.phase_test_run_allowed"
    type = AgentMessageType.STEERING
    text = "The journal tests your commit itself. Test runs left before your next commit: {remaining}"
    turn_limited = False
