class MissingSeedError(Exception):
    """A seed points its rows at a table that no seed has filled yet."""

    def __init__(self, table: str) -> None:
        super().__init__(f"no row of {table} is seeded yet: seed {table} before the rows that point at it")
