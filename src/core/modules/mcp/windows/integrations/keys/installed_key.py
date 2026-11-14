from engine.viewer.window_key import WindowKey


class InstalledKey(WindowKey):
    """The installed data of the mcp.integrations window."""

    name = "installed"
    read = "mcp list"
    events = ["mcp_server.*"]
