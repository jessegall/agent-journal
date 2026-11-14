from engine.viewer.window_key import WindowKey


class CallsKey(WindowKey):
    """The hook calls of the agent shown, two hundred at a time."""

    name = "calls"
    read = "hook-call feed"
    events = ["hook_call.*"]
    arguments = ["session-agent-id", "limit", "before-id", "after-id"]
    page_size = 200
