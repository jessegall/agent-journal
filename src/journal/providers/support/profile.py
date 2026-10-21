from dataclasses import dataclass


@dataclass(frozen=True)
class Profile:
    """A worker or a subagent as each provider reads it: what it does, which tools it may use and what it is told."""

    name: str
    description: str
    tools: str
    body: str
    kind: str = "subagent"
    model: str | None = None

    def model_default(self, selection: str) -> str:
        return selection if self.model is None else self.model

