from dataclasses import dataclass
from core.modules.agents.support.main_row import MainRow


@dataclass(frozen=True)
class EnvironmentFold:
    """The main agent row of one environment that survives, and the main rows folded into it."""

    environment_id: int
    survivor: MainRow
    folded: tuple[MainRow, ...]
