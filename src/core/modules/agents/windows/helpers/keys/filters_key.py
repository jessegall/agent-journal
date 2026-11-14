from engine.viewer.window_key import WindowKey


class FiltersKey(WindowKey):
    """The filters data of the agents.helpers window."""

    name = "filters"
    read = "agent cards --options"
    events = ["agent.*"]
