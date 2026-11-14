from engine.viewer.window_key import WindowKey


class StatusKey(WindowKey):
    """The status data of the library.teams window."""

    name = "status"
    read = "library status"
    events = ["library_connection.*"]
