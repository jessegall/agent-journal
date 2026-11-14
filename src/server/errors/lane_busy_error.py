from server.errors.execution_wait_error import ExecutionWaitError


class LaneBusyError(ExecutionWaitError):
    """A hook, command or viewer request waited past its limit for a place in the instant lane."""
