from features.plans.controller import Plans
from resources.base import SYSTEM


def first_open_phase(record, plan) -> int:
    return Plans(record, actor=SYSTEM)._first_open(plan)


def held(record, todo) -> bool:
    return Plans(record, actor=SYSTEM)._holds(todo)
