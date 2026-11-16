from dataclasses import dataclass


@dataclass(frozen=True)
class ColumnSets:
    """The columns of the schema that hold an agent's id, those that hold an actor's id, and the pairs of a
    model column and an id column, whose model value says which of the two its id is."""

    agent: tuple[tuple[str, str], ...]
    actor: tuple[tuple[str, str], ...]
    pairs: tuple[tuple[str, str, str], ...]
