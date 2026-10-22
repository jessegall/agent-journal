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
    def parsed(cls, data: dict) -> "CheckFinding":
        return cls(cls.text_value(data, "name"), cls.text_value(data, "file"), int(data["line"]) if data.get("line") else 0, cls.text_value(data, "where"), cls.text_value(data, "text"), cls.text_value(data, "group"))

    @staticmethod
    def text_value(data: dict, name: str) -> str:
        return "" if data.get(name) is None else str(data[name])
