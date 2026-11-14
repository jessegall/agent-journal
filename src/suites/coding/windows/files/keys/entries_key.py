from engine.viewer.window_key import WindowKey


class EntriesKey(WindowKey):
    """The files and folders of one folder of the project."""

    name = "entries"
    read = "project-file list {folder}"
