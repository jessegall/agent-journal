from engine.viewer.window_key import WindowKey


class ReportsKey(WindowKey):
    """The reports data of the agents.agents window."""

    name = "reports"
    read = "message agent-reports"
    tab = "reports"
    events = ["message.*"]
    arguments = ["agent"]
