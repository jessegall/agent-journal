class Refusal(Exception):
    """Raised when a command cannot be done, with the reason and what to do instead."""

    def __init__(self, reason: str, remedy: str = "") -> None:
        super().__init__(reason)
        self.reason, self.remedy = reason, remedy

    @property
    def text(self) -> str:
        return f"{self.reason}: {self.remedy}" if self.remedy else self.reason
