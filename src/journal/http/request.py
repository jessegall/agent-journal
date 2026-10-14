from dataclasses import dataclass


@dataclass(frozen=True)
class Request:
    method: str
    path: str
    query: dict
    body: dict
    params: dict
