from features.plans.controller import Plans
from resources.base import SYSTEM


def first_open_phase(record, plan) -> int:
    return Plans(record, actor=SYSTEM)._first_open(plan)


def held(record, todo) -> bool:
    return Plans(record, actor=SYSTEM)._holds(todo)


def counts(record, plan) -> tuple[int, int]:
    """How many of the rows a plan holds are closed, and how many it holds."""
    rows = [row for phase in plan.phases for row in Plans(record, actor=SYSTEM)._members(phase)]
    return sum(1 for row in rows if row.completed), len(rows)
