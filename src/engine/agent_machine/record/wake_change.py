from dataclasses import dataclass

from engine.enums.wake_move import WakeMove


@dataclass(frozen=True)
class WakeChange:
    """What a step did to the agent's durable wake obligation of one work generation, and the causes it names."""

    wake_move: WakeMove
    work_generation: str = ""
    causes: tuple[str, ...] = ()

    @classmethod
    def unchanged(cls) -> "WakeChange":
        return cls(WakeMove.UNCHANGED)
