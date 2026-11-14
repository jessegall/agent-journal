from enum import StrEnum


class WaitingReason(StrEnum):
    """Why an open task that a plan waits on cannot be handed out to the agent that asks."""

    UNAPPROVED_PLAN = "unapproved plan"
    CHECKPOINT = "behind checkpoint"
    LATER_PHASE = "later phase"
    DIFFERENT_ASSIGNEE = "assigned elsewhere"
    ASKER_HOLDER = "held by asker"
    DIFFERENT_HOLDER = "held by another agent"
    NON_TASK_WAIT = "waits on no task"
    CIRCLE = "circle of waits"
    LONG_CHAIN = "chain too long"
