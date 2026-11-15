from engine.driver.message_template import MessageTemplate
from suites.coding.models.enums.ask_topic import AskTopic
from engine.enums.agent_message_type import AgentMessageType


class WorkerTestCommandsMissingMessage(MessageTemplate):
    """The agent message workers.no_test_commands."""

    key = "workers.no_test_commands"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "You have no test commands, so no test can run for you. Only the main agent gives them: journal worker send {worker} --test-command <name>=<command>. " + AskTopic.TESTS.question_line()
    turn_limited = False
    full_text = True
