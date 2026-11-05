from core.modules.library.support.library_failure_error import LibraryFailureError


class LibraryDeniedError(LibraryFailureError):
    """The server answered 403: the role of this user does not allow the request."""
