from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerTestLimitRefusalMessage(MessageTemplate):
    """The nudge processes.test_run_over_limit."""

    key = "processes.test_run_over_limit"
    type = AgentMessageType.REFUSAL
    text = "last run had {count} tests, limit {limit}. Do not split it: run only what proves your change; proofs run at hand-in. " + AskTopic.TESTS.question_line()
    full_text = True
