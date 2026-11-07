from core.modules.library.support.library_failure_error import LibraryFailureError


class LibraryRejectedError(LibraryFailureError):
    """The server answered 400, 413 or 428: it will not accept this request as sent."""
