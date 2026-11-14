from engine.viewer.window_key import WindowKey


class MainAgentKey(WindowKey):
    """The main-agent data of the skills.skills window."""

    name = "main-agent"
    read = "agent main"
    events = ["agent.*"]
