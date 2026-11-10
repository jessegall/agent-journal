class WrongBaseError(Exception):
    """Raised when a registered class does not extend the base its registry list asks for."""
