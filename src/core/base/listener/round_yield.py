class RoundYield:
    """Where a round of the server's background work gives way to the hooks that wait for the database. A run
    outside the server has no hook to give way to, so it gives way to none."""

    def give_way(self) -> None:
        return None
