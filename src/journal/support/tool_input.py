from dataclasses import dataclass


@dataclass(frozen=True)
class ToolInput:
    """The parts of a tool call's input the journal reads: the shell line, the file read or written, and the skill loaded."""

    command: str = ""
    file_path: str = ""
    path: str = ""
    skill: str = ""
    limit: str = ""
    offset: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "ToolInput":
        return cls(**{name: str(data[name]) for name in ("command", "file_path", "path", "skill", "limit", "offset") if data.get(name) is not None})

    @property
    def file(self) -> str:
        """The file the call names, by whichever key its tool uses."""
        return self.file_path or self.path
