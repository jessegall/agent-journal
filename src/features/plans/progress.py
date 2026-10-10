from features.plans.controller import Plans
from features.plans.resource import Tally, tallied
from resources.base import SYSTEM


def first_open_phase(record, plan) -> int:
    return Plans(record, actor=SYSTEM)._first_open(plan)


def held(record, todo) -> bool:
    return Plans(record, actor=SYSTEM)._holds(todo)


def counts(record, plan) -> Tally:
    """How the rows a plan holds stand, over all its phases."""
    return tallied([row for phase in plan.phases for row in Plans(record, actor=SYSTEM)._members(phase)])
