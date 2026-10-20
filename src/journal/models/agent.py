from dataclasses import dataclass, field

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Agent(Scoped):

    session: str = ""
    provider: str = ""
    state: str = "idle"
    data: dict = field(default_factory=dict)
    stack: tuple = ()
    skills_loaded: dict = field(default_factory=dict)
    context_mark: int = 0
    oriented: bool = True
    mark_owed: int = 0
    skills_owed: tuple[str, ...] = ()
    sequence_runs: tuple = ()

    def has_program(self) -> bool:
        return bool(self.provider)
