from collections.abc import Sequence

from engine.model.full_lifecycle import FullLifecycle
from engine.model.model import Model
from engine.model.state_addition import StateAddition


class StateBook:
    """The states and moves of each model: its lifecycle's own, and those the installed modules add."""

    def __init__(self, additions: Sequence[StateAddition] = ()) -> None:
        self.additions = additions

    def lifecycle(self, model: type[Model]) -> FullLifecycle | None:
        if model.lifecycle is None:
            return None
        return FullLifecycle(model, model.lifecycle, tuple(addition for addition in self.additions if addition.holder is model))
