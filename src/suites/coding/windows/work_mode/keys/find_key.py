from engine.viewer.window_key import WindowKey


class FindKey(WindowKey):
    """The index of the setting screens a search looks in."""

    name = "find"
    read = "setting-screen index"
    events = ["setting.*"]
