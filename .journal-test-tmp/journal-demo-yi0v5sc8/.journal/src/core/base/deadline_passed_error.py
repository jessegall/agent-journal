class DeadlinePassedError(Exception):
    """Raised right before a commit when the caller's deadline has passed, so the command writes nothing."""
