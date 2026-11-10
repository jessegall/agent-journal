class HookDatabaseBusyError(Exception):
    """Raised when a hook waits past its limit for the database connection another hook holds."""
