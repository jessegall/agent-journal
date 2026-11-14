class LibraryUnchangedError(Exception):
    """The server answered 304: what the caller kept is still the newest."""
