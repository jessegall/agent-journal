from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class AgentStack(Model):
    """One agent's continuation stack as the machine saves it: its driver and table digest, the slices it is
    pinned to, the schema of its frames, the frames from the bottom as JSON, and its refusal counts. The row's
    version is the agent's part of the answer basis."""

    model_name = "agent_stack"
    cli_name = "agent-stack"

    session_agent_id: int
    driver_name: str
    table_digest: str
    pinned_slices: tuple[str, ...] = ()
    frame_schema: int = 1
    frames: str = "[]"
    stop_refusals: int = 0
    tool_refusals: int = 0
