from engine.errors.exit_coded_error import ExitCodedError


class UsageError(ExitCodedError):
    """Raised when a command line names a model or a subcommand the journal does not have."""

    exit_code = 2
