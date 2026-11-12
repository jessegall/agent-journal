from dataclasses import dataclass
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.helper_role import HelperRole
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import END_CHANGE, Model
from engine.model.errors.model_error import ModelError
from engine.time.timestamp import Timestamp
from engine.agent.agent_policy import AgentPolicy
from core.modules.agents.models.enums.agent_activity import AgentActivity
from core.modules.agents.models.enums.standing_state import StandingState

AGENTS_TABLE = "agents"
ENDED_FIELD = "ended_at"
UPGRADE_RETIREMENT_REASON = "Over the kept limit at the upgrade to kept agents"
PID_FIELD = "pid"
MAIN_ROLE = "main"
LAUNCH_CHANGE = "launch"
MAIN_TITLE = "Main agent"
MAIN_NUMBER = 1


@dataclass(frozen=True, kw_only=True)
class Agent(EnvironmentScoped, Model):
    """One session of an agent program in an environment; its id is its actor's id, so the session has one
    number in every row and every event. The pid and start time of the agent program's process identify it
    among a command's ancestor processes while the session is open."""

    change_names = (END_CHANGE, LAUNCH_CHANGE)
    model_name = "agent"
    numbered = True
    cli_name = "agent"
    search_fields = ["given_name", "program", "program_model", "profile", "session"]
    filter_fields = ["role"]
    shown_properties = ("activity", "display_name", "working_role", "standing")
    listed_properties = tuple(["standing"])

    environment_id: int = 0
    number: int = 0
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
    announced_at: Timestamp | None = None
    halted_at: Timestamp | None = None
    launch_failed_at: Timestamp | None = None

    @property
    def is_typable(self) -> bool:
        return self.paused_at is None and self.ended_at is None and self.retired_at is None

    @property
    def is_paused(self) -> bool:
        return self.paused_at is not None

    @property
    def is_main(self) -> bool:
        return self.role == MAIN_ROLE

    @property
    def is_launched_helper(self) -> bool:
        return not self.is_main and self.launched_at is not None

    @property
    def is_kept_helper(self) -> bool:
        return self.role == HelperRole.HELPER and bool(self.profile) and self.retired_at is None

    def change_name(self, old_row: Model | None) -> str | None:
        if not isinstance(old_row, Agent):
            return None
        if old_row.ended_at is None and self.ended_at is not None:
            return END_CHANGE
        return LAUNCH_CHANGE if self.launched_at is not None and self.launched_at != old_row.launched_at else None

    def ended_timestamp(self) -> Timestamp:
        if self.ended_at is None:
            raise ModelError(f"{self.display_name} has not ended")
        return self.ended_at

    def required_parent_id(self) -> int:
        if self.parent_id is None:
            raise ModelError(f"{self.display_name} has no parent agent")
        return self.parent_id

    def ended(self, timestamp: Timestamp, policy: AgentPolicy) -> "Agent":
        return self.changed(ended_at=timestamp, paused_at=self.paused_at if self.role in policy.pause_retention_roles else None)

    def is_foreign_helper(self, actor: Actor) -> bool:
        return actor.type is ActorType.AGENT and self.parent_id != actor.id

    def retired(self, timestamp: Timestamp, reason: str, actor_id: int) -> "Agent":
        return self.changed(retired_at=timestamp, retirement_reason=reason, retiring_actor_id=actor_id)

    def is_newly_retired(self, previous: "Agent") -> bool:
        return self.retired_at is not None and previous.retired_at is None

    def is_unrelated_agent(self, actor: Actor) -> bool:
        return self.is_foreign_helper(actor) and actor.id != self.id

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
    def standing(self) -> StandingState:
        if self.launch_failed_at is not None:
            return StandingState.FAILED
        if self.ended_at is not None:
            return StandingState.ENDED
        if self.is_main or self.pid is not None or self.launched_at is not None or self.announced_at is not None:
            return StandingState.RUNNING
        return StandingState.UNSTARTED

    @property
    def use_key(self) -> tuple[str, str]:
        """The type and model of the agent, which the counts of agent use are kept by."""
        return (self.profile or self.role, self.program_model or "default")

    @property
    def working_role(self) -> str:
        return "" if self.ended_at is not None else self.role

    @property
    def display_name(self) -> str:
        if self.role != MAIN_ROLE:
            return f"{self.role.capitalize()} {self.number}"
        return MAIN_TITLE

    @property
    def original_launch_name(self) -> str:
        return self.launch_name if self.launch_name is not None else self.session

    @property
    def terminal_id(self) -> int:
        return self.launch_agent_id if self.launch_agent_id is not None else self.id
