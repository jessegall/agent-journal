class TransactionError(Exception):
    """Raised when a command is run at the top inside a transaction, or nested outside one."""
