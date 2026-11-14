from engine.viewer.window_key import WindowKey


class ActiveEnvironmentsKey(WindowKey):
    """The active-environments data of the viewer.shell window."""

    name = "active-environments"
    read = "agent environments"
    events = ["agent.*"]
