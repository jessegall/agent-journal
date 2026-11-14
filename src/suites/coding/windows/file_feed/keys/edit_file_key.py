from engine.viewer.window_key import WindowKey


class EditFileKey(WindowKey):
    """One edited file, by the id of its edit."""

    name = "file.*"
    read = "file-edit file {id}"
