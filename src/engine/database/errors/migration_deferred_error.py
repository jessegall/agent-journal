class MigrationDeferredError(Exception):
    """Raised by a migration that changed nothing and should run again at the next start, so it is not recorded
    as applied; the migration has already said why where a user reads it."""

    @classmethod
    def explained(cls, reason: str) -> "MigrationDeferredError":
        return cls(f"the migration runs again at the next start: {reason}")
