from engine.viewer.model_searcher import ModelSearcher
from core.modules.dumps.models.dump import Dump


class DumpSearcher(ModelSearcher):
    """Finds the dumps whose title, brief or outcome holds the words."""

    model = Dump
