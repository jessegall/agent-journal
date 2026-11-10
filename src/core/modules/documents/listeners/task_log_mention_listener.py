from engine.change.created import Created
from engine.change.updated import Updated
from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.tasks.models.task_log import TaskLog


class TaskLogMentionListener(TextMentionListener[Created[TaskLog] | Updated[TaskLog]]):
    """Links a task log entry to the rows it names."""

    name = "documents.task-log-mentions"
    text_fields = tuple(["line"])
