class ExplanationRollbackError(Exception):
    """Raised at the end of a command run with --explain, so its transaction rolls back."""
