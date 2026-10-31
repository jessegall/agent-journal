class UnknownLoginKeyError(Exception):
    """Raised when a login key is spent already or was never given."""
