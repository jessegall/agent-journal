from dataclasses import dataclass


@dataclass(frozen=True)
class CodexRow:
    """One line of a Codex transcript, as far as a turn is read from it: the line's type, its item's type and role, its text, the tool it calls and what that printed, and when."""

    type: str
    item: str = ""
    role: str = ""
    text: str = ""
    name: str = ""
    output: str = ""
    timestamp: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "CodexRow":
        item = data.get("payload", {})
        text = "\n".join(str(b.get("text", "")) for b in item.get("content", []) if isinstance(b, dict))
        return cls(str(data.get("type", "")), str(item.get("type", "")), str(item.get("role", "")), text, str(item.get("name", "")), str(item.get("output", "")), str(data.get("timestamp", "")))
