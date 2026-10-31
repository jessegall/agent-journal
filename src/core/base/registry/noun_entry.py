from dataclasses import dataclass

from core.base.registry.dotted_path import DottedPath


@dataclass(frozen=True)
class NounEntry:
    """A noun as the registry lists it: the module that adds it, where its model lives, and its typed move
    commands, all by dotted path so a run imports only the noun it is asked about."""

    module: str
    model: DottedPath
    commands: tuple[str, ...]
