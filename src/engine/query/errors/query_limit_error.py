class QueryLimitError(ValueError):
    """Raised when a read names a limit below one row or above the most a read may name."""
