from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.agents.models.enums.agent_activity import AgentActivity


@dataclass(frozen=True)
class AgentTip:
    """What the tooltip of an agent shows: its type and name, the program line, what it is doing and since when,
    and when it was last heard from."""

    agent_id: int
    title: str
    name: str
    program: str
    model: str
    effort: str
    role_label: str
    activity: AgentActivity
    is_retired: bool
    state_started_at: str
    last_activity_at: str

    def line(self) -> str:
        return f"{self.title} {self.name}".rstrip()

    def json(self) -> Mapping[str, object]:
        return {"id": self.agent_id, "title": self.title, "name": self.name, "program": self.program, "model": self.model, "effort": self.effort, "role_label": self.role_label,
                "activity": self.activity.value, "retired": self.is_retired, "since": self.state_started_at, "last_seen": self.last_activity_at}
