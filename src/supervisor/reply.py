from dataclasses import dataclass, field


@dataclass(frozen=True)
class Reply:
    """A request's answer: whether it was done, why not when it was not, and what the verb answers with."""

    ok: bool
    error: str = ""
    answer: dict = field(default_factory=dict)

    @classmethod
    def done(cls, **answer) -> "Reply":
        return cls(True, answer=answer)

    @classmethod
    def refused(cls, why: str) -> "Reply":
        return cls(False, why)

    def to_json(self) -> dict:
        if self.ok:
            return {"ok": True, **self.answer}
        return {"ok": False, "error": self.error}
