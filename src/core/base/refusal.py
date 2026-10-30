class Refusal(Exception):
    """A command that cannot do what was asked: the reason, and the line that would work."""

    def __init__(self, reason: str, remedy: str = "") -> None:
        super().__init__(reason)
        self.reason, self.remedy = reason, remedy

    @property
    def text(self) -> str:
        return f"{self.reason}: {self.remedy}" if self.remedy else self.reason
