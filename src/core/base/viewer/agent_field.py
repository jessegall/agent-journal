from dataclasses import dataclass


@dataclass(frozen=True)
class AgentField:
    """A button field whose value is the number of one running agent, picked from a list
    with the agents of one role on top."""

    name: str
    label: str
    first_role: str = "main"

    def accepts(self, value: str) -> bool:
        return value.isdigit()

    def problems(self, owner: str, targets: frozenset[str]) -> list[str]:
        return []
