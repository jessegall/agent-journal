from dataclasses import dataclass


@dataclass(frozen=True)
class CheckFinding:
    """One thing a check's report found: its name, the file and line it is in, where in them, what it says, and the group it belongs under."""

    name: str
    file: str = ""
    line: int = 0
    where: str = ""
    text: str = ""
    group: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "CheckFinding":
        words = {name: str(data[name]) for name in ("name", "file", "where", "text", "group") if data.get(name) is not None}
        numbers = {name: int(data[name]) for name in ("line",) if data.get(name)}
        return cls(**words, **numbers)
