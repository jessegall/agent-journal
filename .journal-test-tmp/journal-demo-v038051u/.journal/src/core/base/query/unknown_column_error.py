class UnknownColumnError(Exception):
    """Raised when a query filters on a column its model does not have."""
