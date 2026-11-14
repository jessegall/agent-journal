import json
from dataclasses import asdict, dataclass

from engine.enums.process_type import ProcessType


FORMER_TYPE_VALUES = {"write": "edit"}


@dataclass(frozen=True)
class RequestLogEntry:
    """A journal command, hook or viewer request that answered, kept in the request log until a tick
    writes it as a row: the environment, the agent it worked for (none for a main agent or a user)
    and how it ended. A hook the server held or let through with no database at hand names only its
    session, and the tick finds its agent."""

    environment_id: int | None
    agent_id: int | None
    process_type: ProcessType
    line: str
    exit_code: int
    ended_at: str
    session: str = ""

    @classmethod
    def parsed(cls, text: str) -> "RequestLogEntry":
        fields = json.loads(text)
        # A line an earlier version wrote names its type under kind, and the type that edits a file write.
        former = fields.pop("kind", None)
        value = fields.pop("process_type") if former is None else FORMER_TYPE_VALUES.get(former, former)
        return cls(process_type=ProcessType(value), **fields)

    def text(self) -> str:
        return json.dumps(asdict(self))
