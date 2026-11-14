class ReadLimitError(AssertionError):
    """One read loaded more rows than the read limit allows: it must filter, page or count instead. It keeps the
    statement and the number of rows it loaded."""

    count: int = 0
    sql: str = ""

    @classmethod
    def loaded(cls, count: int, limit: int, sql: str) -> "ReadLimitError":
        error = cls(f"one read loaded {count} rows, more than {limit}: {sql}")
        error.count, error.sql = count, sql
        return error
