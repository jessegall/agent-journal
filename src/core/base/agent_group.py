from dataclasses import dataclass


@dataclass(frozen=True)
class AgentGroup:
    """A group of agents shown together in the agent settings: its key and title, the agent type it groups and
    the profiles of that type in it. A group that names no profile takes the profiles of its type that no other
    group names. It holds no limit of its own."""

    key: str
    label: str
    agent_type: str
    profiles: tuple[str, ...] = ()
