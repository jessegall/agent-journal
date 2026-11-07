class MalformedAgentOptions(ValueError):
    """An agent options line that does not follow the declared shape."""

    @classmethod
    def line(cls, line: str, reason: str) -> "MalformedAgentOptions":
        return cls(f"the agent options line {line!r} is not valid: {reason}")
