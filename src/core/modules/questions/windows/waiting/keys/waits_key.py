from engine.viewer.window_key import WindowKey


class WaitsKey(WindowKey):
    """The waits data of the questions.waiting window."""

    name = "waits"
    read = "wait waiting"
    events = ["wait.*"]
