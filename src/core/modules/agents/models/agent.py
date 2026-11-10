from dataclasses import dataclass
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import END_CHANGE, Model
from core.base.model.model_error import ModelError
from engine.time.timestamp import Timestamp
from engine.agent.agent_policy import AgentPolicy
from core.modules.agents.models.enums.agent_activity import AgentActivity

AGENTS_TABLE = "agents"
ENDED_FIELD = "ended_at"
UPGRADE_RETIREMENT_REASON = "Over the kept limit at the upgrade to kept agents"
PID_FIELD = "pid"
MAIN_ROLE = "main"
MAIN_TITLE = "Main agent"


@dataclass(frozen=True, kw_only=True)
class Agent(EnvironmentScoped, Model):
    """One session of an agent program in an environment; its id is its actor's id, so the session has one
    number in every row and every event. The pid and start time of the agent program's process identify it
    among a command's ancestor processes while the session is open."""

    change_names = tuple([END_CHANGE])
    model_name = "agent"
    cli_name = "agent"
    search_fields = ["given_name", "program", "program_model", "profile", "session"]
    filter_fields = ["role"]
    shown_properties = ("activity", "display_name", "working_role")

    environment_id: int = 0
    parent_id: int | None = None
    creator_id: int
    session: str
    program: str
    role: str
    pid: int | None = None
    process_started_at: Timestamp | None = None
    launch_agent_id: int | None = None
    launch_name: str | None = None
    paused_at: Timestamp | None = None
    program_model: str = ""
    profile: str = ""
    given_name: str = ""
    ended_at: Timestamp | None = None
    access: str = "writing"
    retired_at: Timestamp | None = None
    retirement_reason: str = ""
    retiring_actor_id: int | None = None
    usage_limit_ends_at: Timestamp | None = None
    interrupted_at: Timestamp | None = None
    launched_at: Timestamp | None = None
    halted_at: Timestamp | None = None

    def change_name(self, old_row: Model | None) -> str | None:
        newly_ended = isinstance(old_row, Agent) and old_row.ended_at is None and self.ended_at is not None
        return END_CHANGE if newly_ended else None

    def ended_timestamp(self) -> Timestamp:
        if self.ended_at is None:
            raise ModelError(f"agent {self.id} has not ended")
        return self.ended_at

    def ended(self, timestamp: Timestamp, policy: AgentPolicy) -> "Agent":
        return self.changed(ended_at=timestamp, paused_at=self.paused_at if self.role in policy.pause_retention_roles else None)

    def is_child_of_another_agent(self, actor: Actor) -> bool:
        return actor.type is ActorType.AGENT and self.parent_id != actor.id

    def retired(self, timestamp: Timestamp, reason: str, actor_id: int) -> "Agent":
        return self.changed(retired_at=timestamp, retirement_reason=reason, retiring_actor_id=actor_id)

    def has_other_parent_than(self, actor: Actor) -> bool:
        return actor.type is ActorType.AGENT and self.parent_id != actor.id

    @property
    def activity(self) -> AgentActivity:
        if self.ended_at is not None:
            return AgentActivity.ENDED
        if self.halted_at is not None:
            return AgentActivity.HALTED
        if self.paused_at is not None:
            return AgentActivity.PAUSED
        return AgentActivity.USAGE_LIMITED if self.usage_limit_ends_at is not None else AgentActivity.WORKING

    @property
    def working_role(self) -> str:
        return "" if self.ended_at is not None else self.role

    @property
    def display_name(self) -> str:
        return MAIN_TITLE if self.role == MAIN_ROLE else f"{self.role.capitalize()} {self.id}"

    @property
    def original_launch_name(self) -> str:
        return self.launch_name if self.launch_name is not None else self.session

    @property
    def terminal_id(self) -> int:
        return self.launch_agent_id if self.launch_agent_id is not None else self.id
