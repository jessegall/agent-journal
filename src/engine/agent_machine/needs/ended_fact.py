from dataclasses import dataclass

from engine.agent_machine.needs.fact import Fact


@dataclass(frozen=True)
class EndedFact(Fact):
    """The agent was retired or its session replaced: Ended goes on top of its stack and it answers nothing
    more."""

    cause: str
    actor_id: int
