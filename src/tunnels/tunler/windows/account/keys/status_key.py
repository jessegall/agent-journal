from engine.viewer.window_key import WindowKey


class StatusKey(WindowKey):
    """The status data of the tunler.account window."""

    name = "status"
    read = "tunler status"
