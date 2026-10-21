from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class FileEdited(AgentEvent):
    """One file the agent changed, as the journal recorded the edit: the path, the kind of change (create, edit or delete), the counts, the span and the changed lines with their numbers; told to the plugins that hear it once the edit row is committed, after the reply, and never held, since the write has happened."""

    path: str = ""
    kind: str = "edit"
    added: int = 0
    removed: int = 0
    first_line: int = 1
    last_line: int = 1
    lines: tuple = ()
    command: str = ""
