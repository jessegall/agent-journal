class ForeignKeyError(Exception):
    """Raised when rebuilding a table would leave rows pointing at rows that no longer exist."""

    def __init__(self, broken: list[tuple[object, ...]]) -> None:
        super().__init__(f"the rebuild left {len(broken)} rows pointing nowhere: {broken[:5]}")
