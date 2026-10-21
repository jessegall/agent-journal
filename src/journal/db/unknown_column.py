class UnknownColumn(LookupError):
    """A query named a column, or a JSON path, its table does not have."""

    def __init__(self, table: str, name: str) -> None:
        super().__init__(f"no column {name} in {table}")
        self.table, self.name = table, name
