from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from core.base.access import Access
from core.base.agent_type import AgentType
from core.base.dotted_path.dotted_path import DottedPath


@dataclass(frozen=True)
class AgentTypeEntry:
    """An agent type and the module that registered it, with its roster stored by class path."""

    module: str
    key: str
    label: str
    extends: str
    access: Access
    separate_folder: bool
    default_profile: str
    start_line: str
    roster: DottedPath | None

    @classmethod
    def declared(cls, module: str, declaration: AgentType) -> "AgentTypeEntry":
        roster = DottedPath.class_path(declaration.roster) if declaration.roster is not None else None
        return cls(module, declaration.key, declaration.label, declaration.extends, declaration.access,
                   declaration.separate_folder, declaration.default_profile, declaration.start_line, roster)

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "AgentTypeEntry":
        roster = DottedPath(stored["roster"]["text"]) if stored["roster"] is not None else None
        return cls(stored["module"], stored["key"], stored["label"], stored["extends"], Access(stored["access"]),
                   stored["separate_folder"], stored["default_profile"], stored["start_line"], roster)
