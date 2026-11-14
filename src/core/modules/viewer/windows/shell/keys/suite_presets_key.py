from engine.viewer.window_key import WindowKey


class SuitePresetsKey(WindowKey):
    """The suite-presets data of the viewer.shell window."""

    name = "suite-presets"
    read = "suite presets {environment} {page}"
