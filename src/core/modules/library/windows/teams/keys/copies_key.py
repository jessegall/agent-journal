from engine.viewer.window_key import WindowKey


class CopiesKey(WindowKey):
    """The copies data of the library.teams window."""

    name = "copies"
    read = "library copies"
    events = ["library_copy.*"]
    reload_seconds = 30
