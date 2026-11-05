from core.base.viewer.model_searcher import ModelSearcher
from core.modules.processes.models.process import Process


class ProcessSearcher(ModelSearcher):
    """Finds the commands whose line holds the words."""

    model = Process
