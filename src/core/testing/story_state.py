from dataclasses import dataclass, field
from core.base.actor import Actor


@dataclass(frozen=True)
class StoryState:
    """The state a story keeps besides its database, passed from a fixture to the stories that start from it: the
    agent, the subagent it sent and the person it acts as."""

    agent: Actor = field(default_factory=Actor.core)
    user: Actor = field(default_factory=Actor.core)
    subagent: Actor = field(default_factory=Actor.core)
