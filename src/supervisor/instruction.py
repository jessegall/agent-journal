from dataclasses import dataclass


@dataclass(frozen=True)
class Instruction:
    """One datagram from the journal, as the supervisor acts on it."""

    @classmethod
    def parse(cls, datagram: bytes) -> "Instruction": ...


@dataclass(frozen=True)
class Type(Instruction):
    """Type this line into the agent."""

    line: str


@dataclass(frozen=True)
class RestartAgent(Instruction):
    """Stop the agent and start it again on the same conversation, as after an MCP server or a hook is installed."""

    resume: tuple[str, ...]


@dataclass(frozen=True)
class RestartJournal(Instruction):
    """Stop the journal server and start it again, as after an upgrade."""


@dataclass(frozen=True)
class Stop(Instruction):
    """End the session: the agent, then the journal, then the supervisor."""
