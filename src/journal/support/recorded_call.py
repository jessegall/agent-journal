from dataclasses import asdict, dataclass

from journal.support.agent_message import AgentMessage
from journal.support.command_part import CommandPart
from journal.support.file_edit import FileEdit
from journal.support.file_read import FileRead
from journal.support.file_write import FileWrite
from journal.support.no_operation import NoOperation
from journal.support.operation import Operation
from journal.support.shell_line import ShellLine
from journal.support.skill_load import SkillLoad
from journal.support.subagent_dispatch import SubagentDispatch
from journal.support.undecoded_tool import UndecodedTool
from journal.support.user_question import UserQuestion

OPERATIONS = {kind.kind: kind for kind in (ShellLine, FileEdit, FileWrite, FileRead, SkillLoad, SubagentDispatch, AgentMessage, UserQuestion, UndecodedTool)}


@dataclass(frozen=True)
class RecordedCall:
    """A tool call as its entry records it, written and read back in one shape: the shell line and its parts, whether it writes, the files it writes or reads, its work word and the operation its provider decoded."""

    command: str = ""
    parts: tuple[CommandPart, ...] = ()
    writes: bool = False
    edited_paths: tuple[str, ...] = ()
    read_paths: tuple[str, ...] = ()
    work: str = ""
    operation: Operation = NoOperation()

    @classmethod
    def parsed(cls, data: dict) -> "RecordedCall":
        return cls(command=data.get("command", ""), parts=tuple(CommandPart.parsed(part) for part in data.get("parts", ())), writes=bool(data.get("writes")),
                   edited_paths=tuple(data.get("written_paths", ())), read_paths=tuple(data.get("read_paths", ())), work=data.get("work", ""),
                   operation=OPERATIONS.get(data.get("operation", {}).get("kind", ""), NoOperation).parsed(data.get("operation", {})))

    def as_data(self) -> dict:
        return {"command": self.command, "parts": [asdict(part) for part in self.parts], "writes": self.writes, "written_paths": list(self.edited_paths), "read_paths": list(self.read_paths),
                "work": self.work, "operation": self.operation.as_data()}
