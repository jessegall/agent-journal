from collections.abc import Sequence
from dataclasses import dataclass

from core.base.registry.dotted_path import DottedPath


@dataclass(frozen=True)
class ModelEntry:
    """A model as the registry lists it: the module that adds it, the dotted path of its model, and its typed move
    commands, all by dotted path so a run imports only the model it is asked about."""

    module: str
    model: DottedPath
    commands: Sequence[str]
    excluded_subcommands: Sequence[str] = ()
