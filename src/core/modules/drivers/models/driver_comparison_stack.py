from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class DriverComparisonStack(Model):
    """The new machine's own stack of one agent while it only compares: its frames, the plans that stand in for
    blocks the old path never wrote, and its counts; no live answer reads it."""

    model_name = "driver_comparison_stack"
    cli_name = "driver-comparison-stack"

    session_agent_id: int
    frames: str = "[]"
    plans: str = "[]"
    stop_refusals: int = 0
    tool_refusals: int = 0
