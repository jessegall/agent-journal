class DryRunReachedEffect(BaseException):
    """Stops a dry run at its first effect outside the database, which it must not have: everything before it
    passed. It is no Exception, so a handler's own error handling lets it through."""
