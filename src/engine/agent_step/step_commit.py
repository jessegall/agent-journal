from dataclasses import dataclass


@dataclass(frozen=True)
class StepCommit:
    """What a step's save came to: saved with its hook call and the lines of the effects that failed, or a conflict
    because the answer basis changed since the step read it, which writes nothing."""

    is_saved: bool
    hook_call_id: int | None = None
    failures: tuple[str, ...] = ()

    @classmethod
    def saved(cls, hook_call_id: int | None, failures: tuple[str, ...]) -> "StepCommit":
        return cls(True, hook_call_id, failures)

    @classmethod
    def conflict(cls) -> "StepCommit":
        return cls(False)
