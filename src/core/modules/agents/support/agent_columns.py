from dataclasses import dataclass


@dataclass(frozen=True)
class AgentColumns:
    """The columns of the schema that hold an agent: plain id columns, and pairs of a model column and an id
    column whose model names an agent or an actor."""

    plain: tuple[tuple[str, str], ...]
    pairs: tuple[tuple[str, str, str], ...]
