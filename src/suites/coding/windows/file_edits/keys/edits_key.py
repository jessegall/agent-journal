from engine.viewer.window_key import WindowKey


class EditsKey(WindowKey):
    """The file edits of the environment, fifty at a time."""

    name = "edits"
    read = "file-edit list"
    events = ["file_edit.create"]
    arguments = ["limit", "before-id", "after-id"]
    page_size = 50
