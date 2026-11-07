from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.helpers.support.program_state import ProgramState


@dataclass(frozen=True)
class ProgramReadiness:
    """One reading of the programs available for a new agent."""

    states: Mapping[str, ProgramState]

    @property
    def ready_programs(self) -> tuple[str, ...]:
        return tuple(program for program, state in self.states.items() if state.is_ready)

    @property
    def earliest_line(self) -> str:
        timed = [state for state in self.states.values() if state.ends_at is not None]
        if timed:
            earliest = min(timed, key=lambda state: state.ends_at)
            return f"{earliest.line}, until {earliest.ends_at.text}"
        return "; ".join(state.line for state in self.states.values())
