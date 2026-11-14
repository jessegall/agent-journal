from engine.viewer.window import Window
from core.modules.sharing.support.share_searcher import ShareSearcher
from core.modules.sharing.support.skeletons import SHARING_SHARES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_search import WindowSearch
from core.modules.sharing.windows.shares.keys.shares_key import SharesKey
from core.modules.sharing.windows.shares.keys.tunnel_key import TunnelKey
from core.modules.sharing.windows.shares.keys.opens_key import OpensKey
from core.modules.sharing.windows.shares.keys.comments_key import CommentsKey


class SharesWindow(Window):
    """The Shares window."""

    name = "sharing.shares"
    title = "Shares"
    entry = "shares.js"
    loading = WindowLoading.COMPONENT
    skeleton = SHARING_SHARES_SKELETON
    search = WindowSearch(ShareSearcher, "Search the links")
    group = "project"
    icon = WindowIcon.SHARE
    reads = ["share list", "share comments", "share opens", "tunnel status"]
    runs = ["share make", "share revoke", "share accept", "share deny"]
    events = ["share_link.*", "share_comment.*"]
    keys = [SharesKey, TunnelKey, OpensKey, CommentsKey]
