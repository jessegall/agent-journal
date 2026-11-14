from engine.viewer.window_key import WindowKey


class EnvironmentsKey(WindowKey):
    """The environments data of the settings.settings window."""

    name = "environments"
    read = "environment cards"
    tab = "environments"
    events = ["environment.*"]
