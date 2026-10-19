class NotFound(LookupError):
    """No row with that id in that table."""

    def __init__(self, table: str, id: object) -> None:
        super().__init__(f"no {table} row {id}")
        self.table, self.id = table, id
