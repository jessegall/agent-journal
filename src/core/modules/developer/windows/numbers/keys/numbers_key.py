from engine.viewer.window_key import WindowKey


class NumbersKey(WindowKey):
    """The numbers data of the developer.numbers window."""

    name = "numbers"
    read = "developer numbers"
    switches = ["costliest"]
    reload_seconds = 10
