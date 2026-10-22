from dataclasses import dataclass

from journal.engine.base_state import BaseState


@dataclass(frozen=True)
class Duty(BaseState):
    """A worker's floor, the bottom of its stack, never popped and never changed by a work mode: it says and holds nothing of its own, so what a worker hears comes from the worker's own conduct."""

    name = "duty"
    title = "On duty"
