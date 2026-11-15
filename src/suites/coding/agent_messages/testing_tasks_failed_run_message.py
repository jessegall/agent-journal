from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TestingTasksFailedRunMessage(MessageTemplate):
    """The agent message tasks.testing_tasks_failed_run."""

    key = "tasks.testing_tasks_failed_run"
    type = AgentMessageType.NOTICE
    text = "The full test run failed: {tasks} stay in testing"
    turn_limited = False
