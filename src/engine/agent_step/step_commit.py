from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class StepCommit:
    """What a step's save came to: saved with its hook call, the lines of the effects that failed and the input they ran the action with, or a conflict
    because the answer basis changed since the step read it, which writes nothing."""

    is_saved: bool
    hook_call_id: int | None = None
    failures: tuple[str, ...] = ()
    # the tool input the step's admission effects run the action with, if one of them gave one
    updated_input: Mapping[str, object] | None = None

    @classmethod
    def saved(cls, hook_call_id: int | None, failures: tuple[str, ...], updated_input: Mapping[str, object] | None = None) -> "StepCommit":
        return cls(True, hook_call_id, failures, updated_input)

    @classmethod
    def conflict(cls) -> "StepCommit":
        return cls(False)
