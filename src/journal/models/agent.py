from dataclasses import dataclass, field

from journal.events.rows.look_taken import LookTaken
from journal.events.rows.mark_decided import MarkDecided
from journal.events.rows.skill_read import SkillRead
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

    def look_taken(self, at: float) -> "Agent":
        return self.with_(oriented=True).with_event(LookTaken(environment_id=self.environment_id, at=at))

    def mark_decided(self, at: float) -> "Agent":
        return self.with_(mark_owed=0).with_event(MarkDecided(environment_id=self.environment_id, at=at, mark=self.mark_owed))

    def skill_read(self, name: str, digest: str, at: float) -> "Agent":
        loaded = {**self.skills_loaded, name: digest}
        owed = tuple(skill for skill in self.skills_owed if skill != name)
        return self.with_(skills_loaded=loaded, skills_owed=owed).with_event(SkillRead(environment_id=self.environment_id, at=at, skill=name))

    def has_program(self) -> bool:
        return bool(self.provider)
