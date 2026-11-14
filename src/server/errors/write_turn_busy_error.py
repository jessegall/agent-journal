from server.errors.execution_wait_error import ExecutionWaitError


class WriteTurnBusyError(ExecutionWaitError, TimeoutError):
    """A write waited past its limit for the database's write turn."""
