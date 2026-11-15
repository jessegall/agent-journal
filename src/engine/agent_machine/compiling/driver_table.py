import hashlib
from dataclasses import dataclass

from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration


@dataclass(frozen=True)
class DriverTable:
    """The compiled, ordered contributions of one agent type's driver, with the module of each and the digest of the whole."""

    driver: str
    agent_type: str
    entries: tuple[tuple[str, ContributionDeclaration], ...]

    def manifest(self) -> list[str]:
        return [f"{entry.kind} {entry.key} {entry.rank} {module}" for module, entry in self.entries]

    def digest(self) -> str:
        return hashlib.sha256("\n".join(self.manifest()).encode()).hexdigest()[:12]

    def keys(self) -> list[str]:
        return [entry.key for _, entry in self.entries]
