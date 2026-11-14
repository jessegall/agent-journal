from engine.viewer.window_key import WindowKey


class PhonesKey(WindowKey):
    """The phones data of the phone.phones window."""

    name = "phones"
    read = "phone list"
    events = ["phone.*"]
