from dataclasses import dataclass

from engine.model.model import Model

EMPTY_STACKED_STATES = "[]"


@dataclass(frozen=True, kw_only=True)
class AgentStack(Model):
    """One agent's continuation stack as the machine saves it: its driver and table digest, the schema of its
    frames, the frames from the bottom as JSON, and its refusal counts. The row's version is the agent's part of
    the answer basis."""

    model_name = "agent_stack"
    cli_name = "agent-stack"

    session_agent_id: int
    # a row a permission change made before the agent's first step names no driver or table yet
    driver_name: str = ""
    table_digest: str = ""
    stacked_state_schema: int = 1
    stacked_states: str = EMPTY_STACKED_STATES
    stop_refusals: int = 0
    tool_refusals: int = 0
    # the writes outside a step that changed what the agent may do, each of which moves the version
    permission_changes: int = 0

    # a row a permission change made before the agent's first step holds no frame yet
    @property
    def has_stacked_states(self) -> bool:
        return self.stacked_states != EMPTY_STACKED_STATES
