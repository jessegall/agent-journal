class RepeatedCallsError(AssertionError):
    """A request did the same read or started the same command more times than the limit allows."""
