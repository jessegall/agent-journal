class SingleInstance:
    """The base of a class the container builds the first time it is asked for and keeps: listeners, guards,
    command handlers and driver rules. Building one a second time in the same container is a fault."""
