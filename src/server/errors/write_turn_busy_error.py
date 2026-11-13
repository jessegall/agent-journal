class WriteTurnBusyError(TimeoutError):
    """A write waited past its limit for the database's write turn."""

    @classmethod
    def blocked(cls, holder: str, seconds: float) -> "WriteTurnBusyError":
        return cls(f"a write waited {seconds:g} seconds for the database while {holder} held it")
