from engine.viewer.window_key import WindowKey


class TerminalCallsKey(WindowKey):
    """The hook calls of one agent, by its id, two hundred at a time."""

    name = "terminal-calls.*"
    read = "hook-call feed --session-agent-id {id}"
    arguments = ["limit", "before-id", "after-id"]
    page_size = 200
