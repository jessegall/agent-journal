from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent
from journal.models.edit import Edit


@dataclass(frozen=True)
class FileEdited(AgentEvent):
    """One file the agent changed, as the journal recorded the edit: the path, the kind of change (create, edit or delete), the counts, the span and the changed lines with their numbers; asked at the tool's end of the plugins that hold it, inside their window, and told after the reply to the rest."""

    path: str = ""
    kind: str = "edit"
    added: int = 0
    removed: int = 0
    first_line: int = 1
    last_line: int = 1
    lines: tuple = ()
    command: str = ""

    @classmethod
    def recorded(cls, edit: Edit, environment_id: int) -> "FileEdited":
        return cls(path=edit.path, kind=edit.kind, added=edit.added, removed=edit.removed, first_line=edit.first_line, last_line=edit.last_line, lines=edit.rows, command=edit.command, tool_use=edit.tool_use).placed(edit.session, environment_id, "", None, edit.at)
