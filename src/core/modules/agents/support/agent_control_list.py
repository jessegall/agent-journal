from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.provider.control_group import ControlGroup


@dataclass(frozen=True)
class AgentControlList:
    """What the agent bar can change on one agent's program."""

    groups: Sequence[ControlGroup]

    def json(self) -> Mapping[str, object]:
        return {"groups": [{"key": group.key, "label": group.label, "choices": [{"value": choice.value, "label": choice.label} for choice in group.choices]} for group in self.groups]}
