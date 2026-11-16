from engine.viewer.window_key import WindowKey


class StatusKey(WindowKey):
    """The update status data of the updates.updates window."""

    name = "status"
    read = "update check"
    events = ["release.*", "release_install.*"]
