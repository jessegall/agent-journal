from dataclasses import dataclass

from engine.agent_machine.capabilities import Capabilities


@dataclass(frozen=True)
class ProgramDeclaration:
    """An agent program as sync checks it: its name and the capability table its provider declares."""

    name: str
    capabilities: Capabilities
