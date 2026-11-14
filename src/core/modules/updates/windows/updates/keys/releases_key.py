from engine.viewer.window_key import WindowKey


class ReleasesKey(WindowKey):
    """The releases data of the updates.updates window."""

    name = "releases"
    read = "release list"
    events = ["release.*"]
