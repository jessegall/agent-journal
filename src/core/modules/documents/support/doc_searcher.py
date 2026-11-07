from core.base.viewer.model_searcher import ModelSearcher
from core.modules.documents.models.doc import Doc


class DocSearcher(ModelSearcher):
    """Finds the documents whose title, abstract or body holds the words."""

    model = Doc
