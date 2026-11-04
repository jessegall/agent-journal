from core.modules.library.support.library_failure import LibraryFailure


class LibraryRejected(LibraryFailure):
    """The server answered 400, 413 or 428: it will not accept this request as sent."""
