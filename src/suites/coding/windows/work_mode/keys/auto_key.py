from engine.viewer.window_key import WindowKey


class AutoKey(WindowKey):
    """Whether auto mode is on."""

    name = "auto"
    read = "setting show journal.suites.coding.auto-mode"
    events = ["setting.*"]
