class StaleRegistryError(Exception):
    """Raised when the code has changed since the registry was built, so it must be synced first."""
