from engine.viewer.model_searcher import ModelSearcher
from core.modules.memories.models.memory import Memory


class MemorySearcher(ModelSearcher):
    """Finds the memories whose text or reason holds the words."""

    model = Memory
