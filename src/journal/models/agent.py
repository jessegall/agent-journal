from dataclasses import dataclass, field

from journal.events.rows.user_paused import UserPaused
from journal.events.rows.user_resumed import UserResumed
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
    tool_uses: int = 0
    inbox_mark: int = 0

    def paused_by_user(self, time: float) -> "Agent":
        return self.with_event(UserPaused(environment_id=self.environment_id, time=time, agent_session=self.session))

    def resumed_by_user(self, time: float) -> "Agent":
        return self.with_event(UserResumed(environment_id=self.environment_id, time=time, agent_session=self.session))

    def look_taken(self, time: float) -> "Agent":
        return self.with_(oriented=True).with_event(LookTaken(environment_id=self.environment_id, time=time))

    def mark_decided(self, time: float) -> "Agent":
        return self.with_(mark_owed=0).with_event(MarkDecided(environment_id=self.environment_id, time=time, mark=self.mark_owed))

    def skill_read(self, name: str, digest: str, time: float) -> "Agent":
        loaded = {**self.skills_loaded, name: digest}
        owed = tuple(skill for skill in self.skills_owed if skill != name)
        return self.with_(skills_loaded=loaded, skills_owed=owed).with_event(SkillRead(environment_id=self.environment_id, time=time, skill=name))

    def tool_used(self) -> "Agent":
        return self.with_(tool_uses=self.tool_uses + 1)

    def compacted(self) -> "Agent":
        return self.with_(tool_uses=0, inbox_mark=0)

    def message_arrived(self) -> "Agent":
        return self.with_(inbox_mark=self.tool_uses)

    def has_program(self) -> bool:
        return bool(self.provider)
