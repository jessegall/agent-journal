from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RepairPlanStates(Command[int]):
    """Repairs plan states that should never exist: a plan or a task still waiting on a plan that has ended;
    answers how many it repaired."""
