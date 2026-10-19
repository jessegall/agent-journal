import json
from dataclasses import dataclass

from journal.http.support.json_out import JsonOut
from journal.support.not_found import NotFound


@dataclass(frozen=True)
class Response:
    status: int = 200
    body: object = None

    @classmethod
    def json(cls, body: object, status: int = 200) -> "Response":
        return cls(status, body)

    @classmethod
    def not_found(cls, what: str = "") -> "Response":
        return cls(404, {"error": what or "not found"})

    @classmethod
    def missing(cls, error: NotFound) -> "Response":
        return cls.not_found(str(error))

    @classmethod
    def refused(cls, why: str) -> "Response":
        return cls(409, {"error": why})

    def encoded(self) -> bytes:
        return json.dumps(self.body, cls=JsonOut).encode()
