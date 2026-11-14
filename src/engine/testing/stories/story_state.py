from dataclasses import dataclass, field
from engine.actor.actor import Actor


@dataclass(frozen=True)
class StoryState:
    """The state a story keeps besides its database, passed from a fixture to the stories that start from it:
    the agent, its helper and the user it acts as."""

    agent: Actor = field(default_factory=Actor.core)
    user: Actor = field(default_factory=Actor.core)
    helper: Actor = field(default_factory=Actor.core)
