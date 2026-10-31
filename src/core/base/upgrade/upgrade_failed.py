class UpgradeFailed(Exception):
    """Raised when a module's move from version 4 failed; its rows were rolled back and the moves before it stay."""
