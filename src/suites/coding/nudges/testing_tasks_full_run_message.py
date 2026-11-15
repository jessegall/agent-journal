from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TestingTasksFullRunMessage(MessageTemplate):
    """The nudge tasks.testing_tasks_full_run."""

    key = "tasks.testing_tasks_full_run"
    type = AgentMessageType.NOTICE
    text = "{tasks} are in testing: this full run closes them if it passes"
    turn_limited = False
