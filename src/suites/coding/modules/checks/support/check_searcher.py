from core.base.viewer.window_searcher import ModelSearcher
from suites.coding.modules.checks.models.check import Check


class CheckSearcher(ModelSearcher):
    """Finds the checks whose title, brief or command holds the words."""

    model = Check
