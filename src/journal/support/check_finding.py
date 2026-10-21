from dataclasses import dataclass


@dataclass(frozen=True)
class CheckFinding:
    """One thing a check's report found: its name, the file and line it is in, the place in them (the report's where), what it says, and the group it belongs under."""

    name: str
    file: str = ""
    line: int = 0
    place: str = ""
    text: str = ""
    group: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "CheckFinding":
        words = {name: str(data[name]) for name in ("name", "file", "text", "group") if data.get(name) is not None}
        numbers = {name: int(data[name]) for name in ("line",) if data.get(name)}
        place = {"place": str(data["where"])} if data.get("where") is not None else {}
        return cls(**words, **numbers, **place)
