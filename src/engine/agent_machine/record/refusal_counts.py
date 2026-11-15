from dataclasses import dataclass

from engine.agent_stack.escalation import Escalation


@dataclass(frozen=True)
class RefusalCounts:
    """An agent's stops and tool calls refused in a row after a step, and the escalation the step opened or
    joined."""

    stop_refusals: int
    tool_refusals: int
    escalation: Escalation | None = None
