class Refusal(Exception):
    """Raised when a command cannot be done, with the reason and what to do instead."""

    def __init__(self, reason: str, suggestion: str = "") -> None:
        super().__init__(reason)
        self.reason, self.suggestion = reason, suggestion

    @property
    def text(self) -> str:
        return f"{self.reason}: {self.suggestion}" if self.suggestion else self.reason
