from dataclasses import dataclass

WORKER = "worker"
SUBAGENT = "subagent"


@dataclass(frozen=True)
class AgentProfile:
    """A worker or a subagent an agent can start for one kind of job, as its file in the agent program's folder
    holds it, with how often it was used."""

    name: str
    description: str
    tools: str
    body: str
    profile_type: str = SUBAGENT
    model: str = ""
    codex_model: str = ""
    shipped: bool = False
    path: str = ""
    uses: int = 0
    last_used: int = 0
