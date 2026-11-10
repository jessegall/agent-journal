class StaleSessionError(AssertionError):
    """An agent's program session was about to be resumed although its last message is more than an hour old."""
