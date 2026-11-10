from engine.viewer.model_searcher import ModelSearcher
from suites.coding.models.file_edit import FileEdit


class FileEditSearcher(ModelSearcher):
    """Finds the file edits whose path holds the words."""

    model = FileEdit
