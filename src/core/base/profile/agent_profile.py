from dataclasses import dataclass

SUBAGENT = "subagent"


@dataclass(frozen=True)
class AgentProfile:
    """Instructions and program settings for one kind of agent, with its usage counts."""

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
