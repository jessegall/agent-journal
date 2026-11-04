from dataclasses import dataclass
from collections.abc import Sequence

from core.base.type_guards import is_mapping


@dataclass(frozen=True)
class ManifestAlias:
    """A plugin's alias definition, including the flags its manifest enables."""

    name: str
    description: str
    line: str
    variables: tuple[str, ...]
    reader_name: str
    background: bool
    access_flags: tuple[str, ...]

    @classmethod
    def parsed(cls, entry: object) -> "ManifestAlias | None":
        if not is_mapping(entry) or "name" not in entry or "line" not in entry:
            return None
        variables: object = entry["env"] if "env" in entry else None
        pairs = tuple(f"{name}={value}" for name, value in variables.items()) if is_mapping(variables) else ()
        return cls(str(entry["name"]), str(entry["description"]) if "description" in entry else "", str(entry["line"]), pairs,
                   str(entry["reader"]) if "reader" in entry else "", entry.get("background") is True,
                   tuple(name for name, value in entry.items() if isinstance(name, str) and value is True))

    def has_agent_access(self, permission_names: Sequence[str]) -> bool:
        return any(name in self.access_flags for name in permission_names)
