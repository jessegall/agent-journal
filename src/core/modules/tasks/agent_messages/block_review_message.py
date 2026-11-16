from engine.driver.reminder_declaration import ReminderDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from core.modules.tasks.support.closed.closed_tasks import ClosedTasks
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType

BLOCK_REVIEW_REMINDER = ReminderDeclaration("tasks.block_review", Interval(Seconds(900), ClosedTasks(5)), 2)


class BlockReviewMessage(MessageTemplate):
    """The agent message tasks.block_review."""

    key = "tasks.block_review"
    type = AgentMessageType.NOTICE
    text = "Review blocked task {task}: renew its block with a reason, unblock it, or close it"
    interval = BLOCK_REVIEW_REMINDER.interval
    turn_limited = False
    plural_text = 'review blocked tasks {task}: renew each block with a reason, unblock it, or close it'
    id_field = "task"
