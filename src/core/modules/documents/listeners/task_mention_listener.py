from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.tasks.models.task import Task


class TaskMentionListener(TextMentionListener):
    """Links a saved task to the rows it names."""

    model = Task
    text_fields = ("title", "brief")
    name = "documents.task-mentions"
    event = "task.create|task.update"
