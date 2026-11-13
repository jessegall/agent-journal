from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class BoardTarget:
    """One target a person can give rules to in the Assign tab: the main agent, one agent, or the agents of
    one program and model."""

    key: str
    target: str
    label: str
    agent_id: int | None = None
    program: str = ""
    program_model: str = ""
    running: bool = False
    open_tasks: int = 0
    waiting: str = ""

    @property
    def description(self) -> str:
        return f"Program: {self.program} {self.program_model}" if self.program else ""

    def json(self) -> Mapping[str, object]:
        return {"key": self.key, "target": self.target, "label": self.label, "description": self.description, "agent_id": self.agent_id, "program": self.program, "program_model": self.program_model,
                "running": self.running, "open_tasks": self.open_tasks, "waiting": self.waiting}
