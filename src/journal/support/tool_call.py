from dataclasses import asdict, dataclass

from journal.support.command_part import CommandPart


@dataclass(frozen=True)
class ToolCall:
    """The one reading of a tool call, made where the hook is translated and carried on both tool events: the tool and its input as they came, the shell line and its parts, whether the call writes and which files it writes or reads, and the skill it loads."""

    tool: str
    input: dict
    command: str = ""
    parts: tuple[CommandPart, ...] = ()
    is_journal: bool = False
    writes: bool = False
    edited_paths: tuple[str, ...] = ()
    read_paths: tuple[str, ...] = ()
    file_lines: int = 0
    skill_loaded: str = ""
    work: str = ""

    @property
    def input_text(self) -> str:
        return " ".join(str(value) for value in self.input.values())

    def as_data(self) -> dict:
        return {"command": self.command, "parts": [asdict(part) for part in self.parts], "writes": self.writes, "written_paths": list(self.edited_paths), "read_paths": list(self.read_paths), "work": self.work}

    def is_script(self) -> bool:
        from journal.support.writes import Writes
        return any(Writes.is_script(part.text) for part in self.parts)

    def journal_parts(self) -> tuple[int, int]:
        return sum(1 for part in self.parts if part.is_journal), len(self.parts)
