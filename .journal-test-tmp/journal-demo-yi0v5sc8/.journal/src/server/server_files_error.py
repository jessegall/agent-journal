class ServerFilesError(Exception):
    """Raised when a server's files are changed by a process that does not hold the server lock."""
