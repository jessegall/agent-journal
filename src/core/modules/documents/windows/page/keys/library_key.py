from engine.viewer.window_key import WindowKey


class LibraryKey(WindowKey):
    """The library data of the documents.page window."""

    name = "library"
    read = "document library"
    arguments = ["type", "state", "before"]
