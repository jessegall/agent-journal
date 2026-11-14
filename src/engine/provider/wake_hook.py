from collections.abc import Mapping
from dataclasses import dataclass

from engine.provider.enums.wake_answer import WakeAnswer


@dataclass(frozen=True)
class WakeHook:
    """The hook entry an agent program is woken through: the program's own event it sits under, how the program is
    woken by its answer, the entry's fields beside the command and the entry's timeout."""

    event: str
    answer: WakeAnswer
    fields: Mapping[str, object]
    limit_seconds: int
