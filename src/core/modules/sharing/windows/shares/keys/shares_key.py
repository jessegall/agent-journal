from engine.viewer.window_key import WindowKey


class SharesKey(WindowKey):
    """The shares data of the sharing.shares window."""

    name = "shares"
    read = "share list"
    events = ["share_link.*", "share_comment.*"]
