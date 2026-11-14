from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class CommentsKey(WindowKey):
    """The comments.* data of the sharing.shares window."""

    name = "comments.*"
    read = "share comments {id}"
    events = ["share_comment.*"]
    loading = KeyLoading.REQUESTED
