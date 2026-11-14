from engine.viewer.model_searcher import ModelSearcher
from core.modules.sharing.models.share_link import ShareLink


class ShareSearcher(ModelSearcher):
    """Finds the share links by the type of row they share and their state."""

    model = ShareLink
