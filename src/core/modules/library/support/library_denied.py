from core.modules.library.support.library_failure import LibraryFailure


class LibraryDenied(LibraryFailure):
    """The server answered 403: the role of this user does not allow the request."""
