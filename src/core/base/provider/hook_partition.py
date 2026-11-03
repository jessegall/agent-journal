from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class HookPartition:
    kept: dict[str, list[object]]
    native: dict[str, list[object]]
    journal: dict[str, list[object]]
    commands: Sequence[tuple[str, str, Mapping[str, object]]]


