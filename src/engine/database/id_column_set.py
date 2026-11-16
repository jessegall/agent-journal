from dataclasses import dataclass


@dataclass(frozen=True)
class IdColumnSet:
    """The columns of the schema that hold an actor's or an agent's id: plain id columns, and pairs of a model
    column and an id column whose model names an agent or an actor."""

    plain: tuple[tuple[str, str], ...]
    pairs: tuple[tuple[str, str, str], ...]
