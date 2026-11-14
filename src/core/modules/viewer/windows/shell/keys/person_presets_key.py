from engine.viewer.window_key import WindowKey


class PersonPresetsKey(WindowKey):
    """The person-presets data of the viewer.shell window."""

    name = "person-presets"
    read = "person-preset list"
    arguments = ["page"]
