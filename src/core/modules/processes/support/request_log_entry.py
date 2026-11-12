import json
from dataclasses import asdict, dataclass

from engine.enums.process_kind import ProcessKind


@dataclass(frozen=True)
class RequestLogEntry:
    """A journal command, hook or viewer request that answered, kept in the request log until a tick writes it as a
    row: the environment, the agent it worked for (none for a main agent or a person) and how it ended. A hook the
    server held or let through with no database at hand names only its session, and the tick finds its agent."""

    environment_id: int | None
    agent_id: int | None
    kind: ProcessKind
    line: str
    exit_code: int
    ended_at: str
    session: str = ""

    @classmethod
    def parsed(cls, text: str) -> "RequestLogEntry":
        fields = json.loads(text)
        return cls(fields["environment_id"], fields["agent_id"], ProcessKind(fields["kind"]), fields["line"], fields["exit_code"], fields["ended_at"], fields.get("session", ""))

    def text(self) -> str:
        return json.dumps(asdict(self))
