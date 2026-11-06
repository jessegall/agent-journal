class RoundYield:
    """Where a round of the server's background work pauses for the hooks that wait for the database. A run
    outside the server has no hook to pause for, so it never pauses."""

    def pause(self) -> None:
        return None
