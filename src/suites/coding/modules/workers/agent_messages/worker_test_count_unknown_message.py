from engine.driver.message_template import MessageTemplate
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts
from engine.enums.agent_message_type import AgentMessageType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerTestCountUnknownMessage(MessageTemplate):
    """The agent message processes.test_count_unknown."""

    key = "processes.test_count_unknown"
    type = AgentMessageType.STEERING
    text = ("Output {output} stopped: could not count the tests, read that output for why. Exits: "
                                        + ExitTexts.template((ReadingExit.COUNT_TESTS,)) + ". " + AskTopic.TESTS.question_line())
    wakes_agent = True
    full_text = True
