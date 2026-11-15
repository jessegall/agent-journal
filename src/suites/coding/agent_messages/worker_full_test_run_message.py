from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerFullTestRunMessage(MessageTemplate):
    """The agent message coding.worker_full_test_run."""

    key = "coding.worker_full_test_run"
    type = AgentMessageType.REFUSAL
    text = 'a worker runs only the tests of what it changed, never the whole suite: name the test files. ' + AskTopic.TOOL.question_line()
    turn_limited = False
    full_text = True
