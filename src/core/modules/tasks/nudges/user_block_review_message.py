from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UserBlockReviewMessage(MessageTemplate):
    """The nudge tasks.user_block_review."""

    key = "tasks.user_block_review"
    type = AgentMessageType.NOTICE
    text = "Task {task} waits on the user: tell them what is still needed"
    turn_limited = False
    plural_text = 'tasks {task} wait on the user: tell the user what is still needed'
    id_field = "task"
