from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class AgentSubject(Model):
    """A row one of an agent's frames or constraints depends on, by model and row id, so a change to that row names
    the agents to step; changed by difference at each save."""

    model_name = "agent_subject"
    cli_name = "agent-subject"

    session_agent_id: int
    subject_model: str
    subject_id: int
    frame_key: str
    generation: str
