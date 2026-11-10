class UnsupportedColumnTypeError(Exception):
    """Raised when a model has a field whose type cannot be stored in the database."""
