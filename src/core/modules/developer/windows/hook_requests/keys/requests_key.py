from engine.viewer.window_key import WindowKey


class RequestsKey(WindowKey):
    """The requests data of the developer.hook-requests window."""

    name = "requests"
    read = "developer hook-requests"
    arguments = ["categories", "families", "senders"]
