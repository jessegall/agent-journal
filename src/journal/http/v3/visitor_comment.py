from dataclasses import dataclass


@dataclass(frozen=True)
class VisitorComment:
    """What a link's page sends when a visitor comments: the row it is under, the visitor's name and their words."""

    about: str
    name: str
    text: str

    @classmethod
    def from_payload(cls, payload: dict) -> "VisitorComment":
        return cls(str(payload.get("about", "")), str(payload.get("name", "")), str(payload.get("text", "")))
