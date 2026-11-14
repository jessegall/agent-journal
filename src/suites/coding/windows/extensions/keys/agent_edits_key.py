from engine.viewer.window_key import WindowKey


class AgentEditsKey(WindowKey):
    """The file edits of one agent, by its id, fifty at a time."""

    name = "agent-edits.*"
    read = "file-edit list --agent {id}"
    arguments = ["limit", "before-id", "after-id"]
    page_size = 50
