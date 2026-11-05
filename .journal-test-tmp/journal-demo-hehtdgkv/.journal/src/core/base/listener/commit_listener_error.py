class CommitListenerError(Exception):
    """Raised when a registered commit listener's path leads to a class that is not a commit listener."""
