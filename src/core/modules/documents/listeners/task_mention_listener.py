from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.tasks.models.task import Task
from engine.event.changed import Changed


class TaskMentionListener(TextMentionListener[Changed[Task]]):
    """Links a saved task to the rows it names."""

    text_fields = ("title", "brief", "outcome")
    name = "documents.task-mentions"
