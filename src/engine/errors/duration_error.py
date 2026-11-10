from engine.errors.refusal import Refusal


class DurationError(Refusal):
    """A duration is missing, invalid or not positive."""

    @classmethod
    def invalid(cls, value: object) -> "DurationError":
        return cls(f"duration {value!r} must be positive", "use seconds or a duration such as 30s, 5m, 2h or 1d")
