class MigrationDeferred(Exception):
    """Raised by a migration that changed nothing and should run again at the next start, so it is not recorded
    as applied; the migration has already said why where a person reads it."""

    @classmethod
    def because(cls, reason: str) -> "MigrationDeferred":
        return cls(f"the migration runs again at the next start: {reason}")
