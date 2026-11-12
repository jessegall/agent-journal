class RunTimeLimitError(RuntimeError):
    """A run through the door went on past its time limit."""

    @classmethod
    def passed(cls, command: str, limit_seconds: float) -> "RunTimeLimitError":
        return cls(f"{command} ran past its limit of {limit_seconds:g} seconds")
