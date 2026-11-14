from engine.viewer.window_key import WindowKey


class CallsKey(WindowKey):
    """The calls data of the drivers.hook-calls window."""

    name = "calls"
    read = "hook-call feed"
    events = ["hook_call.*"]
    arguments = ["session-agent-id", "limit", "before-id", "after-id"]
    page_size = 50
