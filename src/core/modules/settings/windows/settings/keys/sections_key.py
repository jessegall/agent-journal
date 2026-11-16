from engine.viewer.window_key import WindowKey


class SectionsKey(WindowKey):
    """The sections the environment's suite adds to the settings.settings window."""

    name = "sections"
    read = "suite sections"
    tab = "settings"
    events = ["setting.*"]
