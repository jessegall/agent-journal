from dataclasses import dataclass

from core.modules.agents.models.enums.standing_state import StandingState


@dataclass(frozen=True)
class Standing:
    """The one answer to whether an agent's program runs, with the reason for an agent that ended."""

    stage: StandingState
    reason: str | None = None

    @property
    def is_running(self) -> bool:
        return self.stage is StandingState.RUNNING

    @property
    def text(self) -> str:
        stage_line = f"standing: {self.stage.value}"
        return stage_line if self.reason is None else f"{stage_line}\nreason: {self.reason}"
