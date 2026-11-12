class ExitCodedError(Exception):
    """An error that ends a command line with an exit code of its own. An error with no code of its own is an
    unexpected one and ends with this code."""

    exit_code = 3
