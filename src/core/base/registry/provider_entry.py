from dataclasses import dataclass

from engine.dotted_path.dotted_path import DottedPath


@dataclass(frozen=True)
class ProviderEntry:
    """A registered agent program: its name, its class, the module that ships it, and its title."""

    name: str
    path: DottedPath
    module: str
    title: str
