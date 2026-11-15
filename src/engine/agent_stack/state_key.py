from dataclasses import dataclass

from engine.agent_stack.row_reference import RowReference


@dataclass(frozen=True)
class StateKey:
    """The identity of a need and of its stacked state: the state class, the subject and the generation it belongs to."""

    state_name: str
    subject: RowReference | None
    generation: str
