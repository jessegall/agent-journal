from engine.viewer.window_key import WindowKey


class OutputKey(WindowKey):
    """The output.* data of the messages.chat window."""

    name = "output.*"
    read = "output page {id}"
    arguments = ["after", "before"]
