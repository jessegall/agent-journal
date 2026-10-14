from dataclasses import dataclass


@dataclass(frozen=True)
class Response:
    status: int = 200
    body: object = None

    @classmethod
    def json(cls, body: object, status: int = 200) -> "Response": ...

    @classmethod
    def not_found(cls) -> "Response": ...
