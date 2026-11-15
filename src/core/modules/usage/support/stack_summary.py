from dataclasses import dataclass


@dataclass(frozen=True)
class StackSummary:
    """What an agent's card shows of its stack: the top stacked state, the refusal counts and the open escalation, if any."""

    top: str
    stop_refusals: int
    tool_refusals: int
    escalation_id: int | None
