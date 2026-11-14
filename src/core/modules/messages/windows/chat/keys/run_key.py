from engine.viewer.window_key import WindowKey


class RunKey(WindowKey):
    """The run.* data of the messages.chat window."""

    name = "run.*"
    read = "process card {id}"
