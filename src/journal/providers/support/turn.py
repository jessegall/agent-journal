from dataclasses import dataclass, field


@dataclass(frozen=True)
class Turn:
    """One entry of an agent's conversation as the viewer's log shows it: who spoke, what kind it is, its text and the tools it used."""

    line: int
    who: str
    kind: str
    at: float
    text: str = ""
    tools: list[str] = field(default_factory=list)
