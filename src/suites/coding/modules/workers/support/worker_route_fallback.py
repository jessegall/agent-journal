from dataclasses import dataclass

from core.modules.helpers.support.program_state import ProgramState


@dataclass(frozen=True)
class WorkerRouteFallback:
    """A matched destination that could not take a task."""

    route_id: int
    program: str
    state: ProgramState

    @property
    def line(self) -> str:
        availability_text = f" until {self.state.ends_at.text}" if self.state.ends_at is not None else ""
        return f"route {self.route_id} sends to {self.program}, out{availability_text}: {self.state.line}"
