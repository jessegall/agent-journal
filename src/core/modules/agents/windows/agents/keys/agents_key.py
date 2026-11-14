from engine.viewer.window_key import WindowKey


class AgentsKey(WindowKey):
    """The agents data of the agents.agents window."""

    name = "agents"
    read = "agent cards"
    events = ["agent.*", "agent_block.*", "task.*"]
    arguments = ["show", "search", "limit", "roles", "profiles", "programs"]
