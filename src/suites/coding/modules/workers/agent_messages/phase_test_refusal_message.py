from engine.driver.message_template import MessageTemplate
from suites.coding.models.enums.ask_topic import AskTopic
from engine.enums.agent_message_type import AgentMessageType


class PhaseTestRefusalMessage(MessageTemplate):
    """The nudge workers.phase_test_refused."""

    key = "workers.phase_test_refused"
    type = AgentMessageType.SAFETY_REFUSAL
    text = 'No test runs left before your next commit: commit and go on. ' + AskTopic.TESTS.question_line()
    turn_limited = False
    full_text = True
