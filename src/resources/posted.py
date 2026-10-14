from dataclasses import dataclass, field


@dataclass(frozen=True)
class Posted:
    """What a service is sent: its query and the variables the query runs with."""

    query: str
    variables: dict = field(default_factory=dict)
