from engine.viewer.window_key import WindowKey


class AgentEditsKey(WindowKey):
    """The file edits of the agent shown, fifty at a time."""

    name = "edits"
    read = "file-edit list"
    events = ["file_edit.create"]
    arguments = ["agent", "limit", "before-id", "after-id"]
    page_size = 50
