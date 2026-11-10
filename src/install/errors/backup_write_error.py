class BackupWriteError(Exception):
    """The backup of version 4's database could not be written, so the upgrade changes nothing."""
