from dataclasses import dataclass
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class HelperStartState:
    """Whether a profile can start a helper, which helpers can take the job, and why a new one is blocked."""

    reason: str | None
    programs: tuple[str, ...]
    idle_helpers: tuple[Agent, ...] = ()
    can_start_new: bool = False
    new_reason: str = ""
