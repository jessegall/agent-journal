from core.base.viewer.window_searcher import ModelSearcher
from core.modules.sharing.models.share_link import ShareLink


class ShareSearcher(ModelSearcher):
    """Finds the share links by the kind of row they share and their state."""

    model = ShareLink
