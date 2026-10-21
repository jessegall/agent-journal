from dataclasses import dataclass, field


@dataclass(frozen=True)
class Reply:
    """A request's answer: whether it was done, why not when it was not, and what the verb answers with."""

    is_success: bool
    error: str = ""
    answer: dict = field(default_factory=dict)

    @classmethod
    def success(cls, **answer) -> "Reply":
        return cls(True, answer=answer)

    @classmethod
    def refused(cls, reason: str) -> "Reply":
        return cls(False, reason)

    def as_json(self) -> dict:
        if self.is_success:
            return {"ok": True, **self.answer}
        return {"ok": False, "error": self.error}
