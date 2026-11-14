from engine.viewer.model_searcher import ModelSearcher
from core.modules.tasks.models.task import Task


class TaskSearcher(ModelSearcher):
    """Finds the tasks whose title, brief or outcome holds the words."""

    model = Task
