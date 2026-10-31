class DryRunEndError(Exception):
    """Raised inside a move's transaction in a dry run, so the transaction is rolled back with the counts kept."""
