from dataclasses import dataclass, field


@dataclass(frozen=True)
class Turn:
    """One entry of an agent's conversation as the viewer's log shows it: who spoke, what kind it is, its text and the tools it used."""

    line: int
    who: str
    kind: str
    at: float
    text: str = ""
    """What was said; a call of a tool says nothing but its tool."""
    tools: list[str] = field(default_factory=list)
