from core.modules.library.support.library_failure import LibraryFailure


class LibraryItemRemoved(LibraryFailure):
    """The server answered 404 or 410: the item is removed or does not exist."""
