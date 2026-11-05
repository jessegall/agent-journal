from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.tasks.models.task import Task
from core.base.change.created import Created
from core.base.change.updated import Updated


class TaskMentionListener(TextMentionListener[Created[Task] | Updated[Task]]):
    """Links a saved task to the rows it names."""

    text_fields = ("title", "brief")
    name = "documents.task-mentions"
