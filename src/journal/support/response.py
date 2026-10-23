from dataclasses import dataclass, field

from journal.support.missing_row import MissingRow


@dataclass(frozen=True)
class Response:
    status: int = 200
    body: object = None
    headers: dict = field(default_factory=dict)

    @classmethod
    def json(cls, body: object, status: int = 200) -> "Response":
        return cls(status, body)

    @classmethod
    def absent(cls, subject: str = "") -> "Response":
        return cls(404, {"error": subject or "not found"})

    @classmethod
    def missing(cls, error: MissingRow) -> "Response":
        return cls.absent(str(error))

    @classmethod
    def refused(cls, reason: str) -> "Response":
        return cls(409, {"error": reason})

