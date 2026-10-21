from dataclasses import dataclass


@dataclass(frozen=True)
class VisitorComment:
    """What a link's page sends when a visitor comments: the row it is under, as docs:12, the visitor's name and their words."""

    on: str
    name: str
    text: str

    @classmethod
    def parsed(cls, payload: dict) -> "VisitorComment":
        return cls(str(payload.get("on", "")), str(payload.get("name", "")), str(payload.get("text", "")))
