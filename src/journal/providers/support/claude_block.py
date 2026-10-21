from dataclasses import dataclass


@dataclass(frozen=True)
class ClaudeBlock:
    """One block of a Claude transcript row's content: text, thinking, a tool's use or its result."""

    type: str
    text: str = ""
    thinking: str = ""
    name: str = ""
    result: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "ClaudeBlock":
        content = data.get("content", "")
        result = content if isinstance(content, str) else "\n".join(str(b.get("text", "")) for b in content if isinstance(b, dict))
        return cls(str(data.get("type", "")), str(data.get("text", "")), str(data.get("thinking", "")), str(data.get("name", "")), result)
