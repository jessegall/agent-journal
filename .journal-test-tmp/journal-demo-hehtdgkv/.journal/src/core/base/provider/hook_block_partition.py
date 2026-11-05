from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class HookBlockPartition:
    kept: Sequence[object]
    native: Sequence[object]
    journal: Sequence[object]
    commands: Sequence[tuple[str, str, Mapping[str, object]]]


