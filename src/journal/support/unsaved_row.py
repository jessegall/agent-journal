class UnsavedRow(LookupError):
    """A row asked for its number before it was saved, so it has none."""

    def __init__(self, table: str) -> None:
        super().__init__(f"a {table} row has no number until it is saved")
        self.table = table
