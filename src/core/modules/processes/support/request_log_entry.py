import json
from dataclasses import asdict, dataclass

from engine.enums.process_kind import ProcessKind


@dataclass(frozen=True)
class RequestLogEntry:
    """A journal command or viewer request that answered, kept in the request log until a tick writes it as a row:
    the environment, the agent it worked for (none for a main agent or a person) and how it ended."""

    environment_id: int
    agent_id: int | None
    kind: ProcessKind
    line: str
    exit_code: int
    ended_at: str

    @classmethod
    def parsed(cls, text: str) -> "RequestLogEntry":
        fields = json.loads(text)
        return cls(fields["environment_id"], fields["agent_id"], ProcessKind(fields["kind"]), fields["line"], fields["exit_code"], fields["ended_at"])

    def text(self) -> str:
        return json.dumps(asdict(self))
