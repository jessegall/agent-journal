from engine.driver.message_template import MessageTemplate
from suites.coding.models.enums.ask_topic import AskTopic
from engine.enums.agent_message_type import AgentMessageType


class WorkerTestLineRefusalMessage(MessageTemplate):
    """The nudge workers.named_tests_only."""

    key = "workers.named_tests_only"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "A test runs only through your test commands. Yours: {names}. " + AskTopic.TESTS.question_line()
    turn_limited = False
    full_text = True
