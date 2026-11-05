class StrayVersionFourError(Exception):
    """A version 4 journal.db is in the folder again after the upgrade finished: version 4 still ran there."""
