from engine.viewer.window_key import WindowKey


class FiltersKey(WindowKey):
    """The filters data of the agents.agents window."""

    name = "filters"
    read = "agent cards --options"
    events = ["agent.*"]
