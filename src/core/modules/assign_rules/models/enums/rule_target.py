from enum import StrEnum


class RuleTarget(StrEnum):
    """Who a rule gives a task to: the running main agent, one agent, or one of the agents on a program and model."""

    MAIN = "main"
    AGENT = "agent"
    MODEL = "model"
