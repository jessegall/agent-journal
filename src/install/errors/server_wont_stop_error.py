class ServerWontStopError(Exception):
    """Raised when a running server was asked to stop and had not stopped within the limit."""
