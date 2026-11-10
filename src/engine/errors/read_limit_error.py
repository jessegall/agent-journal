class ReadLimitError(AssertionError):
    """One read loaded more rows than the read limit allows: it must filter, page or count instead."""

    @classmethod
    def loaded(cls, count: int, limit: int, sql: str) -> "ReadLimitError":
        return cls(f"one read loaded {count} rows, more than {limit}: {sql}")
