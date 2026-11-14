class UnnamedColumnError(ValueError):
    """Raised when an inner query that selects every column is used to match one column."""
