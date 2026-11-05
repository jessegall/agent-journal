from core.modules.library.support.library_failure_error import LibraryFailureError


class LibraryItemRemovedError(LibraryFailureError):
    """The server answered 404 or 410: the item is removed or does not exist."""
