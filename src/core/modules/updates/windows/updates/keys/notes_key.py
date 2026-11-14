from engine.viewer.window_key import WindowKey


class NotesKey(WindowKey):
    """The notes data of the updates.updates window."""

    name = "notes"
    read = "update notes"
    arguments = ["page"]
