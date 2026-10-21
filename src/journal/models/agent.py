from dataclasses import dataclass, field

from journal.events.rows.user_paused import UserPaused
from journal.events.rows.user_resumed import UserResumed
from journal.events.rows.overview_read import OverviewRead
from journal.events.rows.context_decided import ContextDecided
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
    context_threshold: int = 0
    has_overview: bool = True
    threshold_due: int = 0
    skills_due: tuple[str, ...] = ()
    sequence_runs: tuple = ()
    tool_uses: int = 0
    inbox_position: int = 0

    def user_paused(self, time: float) -> "Agent":
        return self.with_event(UserPaused(environment_id=self.environment_id, time=time, agent_session=self.session))

    def user_resumed(self, time: float) -> "Agent":
        return self.with_event(UserResumed(environment_id=self.environment_id, time=time, agent_session=self.session))

    def overview_read(self, time: float) -> "Agent":
        return self.with_(has_overview=True).with_event(OverviewRead(environment_id=self.environment_id, time=time))

    def context_decided(self, time: float) -> "Agent":
        return self.with_(threshold_due=0).with_event(ContextDecided(environment_id=self.environment_id, time=time, threshold=self.threshold_due))

    def skill_read(self, name: str, digest: str, time: float) -> "Agent":
        loaded = {**self.skills_loaded, name: digest}
        obligations = tuple(skill for skill in self.skills_due if skill != name)
        return self.with_(skills_loaded=loaded, skills_due=obligations).with_event(SkillRead(environment_id=self.environment_id, time=time, skill=name))

    def tool_used(self) -> "Agent":
        return self.with_(tool_uses=self.tool_uses + 1)

    def compacted(self) -> "Agent":
        return self.with_(tool_uses=0, inbox_position=0)

    def message_arrived(self) -> "Agent":
        return self.with_(inbox_position=self.tool_uses)

    def has_program(self) -> bool:
        return bool(self.provider)
