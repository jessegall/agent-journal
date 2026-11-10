class BackupMismatchError(Exception):
    """Raised when the copy of the version 4 database does not hold the rows the original does."""
