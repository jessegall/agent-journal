class CliRequestError(Exception):
    """Raised when the body of a /cli request is not a command line and its caller."""
