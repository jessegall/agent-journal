from dataclasses import dataclass

from core.base.type_guards import is_mapping


@dataclass(frozen=True)
class ManifestAlias:
    """An alias a plugin ships: its name and description, its line with paths in the plugin's folder, its
    variables as NAME=value, the reader that reads its output, and whether it runs in the background and is
    a worker's to run too."""

    name: str
    description: str
    line: str
    variables: tuple[str, ...]
    reader_name: str
    background: bool
    worker_access: bool

    @classmethod
    def parsed(cls, entry: object) -> "ManifestAlias | None":
        if not is_mapping(entry) or "name" not in entry or "line" not in entry:
            return None
        variables: object = entry["env"] if "env" in entry else None
        pairs = tuple(f"{name}={value}" for name, value in variables.items()) if is_mapping(variables) else ()
        return cls(str(entry["name"]), str(entry["description"]) if "description" in entry else "", str(entry["line"]), pairs,
                   str(entry["reader"]) if "reader" in entry else "", entry.get("background") is True, entry.get("workers") is True)
