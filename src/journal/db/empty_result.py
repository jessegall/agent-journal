class EmptyResult(LookupError):
    """A query that always answers one row, such as a count or a pragma, answered none."""

    def __init__(self, sql: str) -> None:
        super().__init__(f"no row from {sql}")
        self.sql = sql
