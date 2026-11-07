from core.base.refusal import Refusal


class GuardRefusal(Refusal):
    """A refusal from a guard, naming the guard and the flag that lets a person pass it."""

    def __init__(self, guard: str, refusal: Refusal, skip_flag: str) -> None:
        super().__init__(refusal.reason, refusal.suggestion)
        self.guard, self.skip_flag = guard, skip_flag
        self.refusal = refusal

    @property
    def is_completed(self) -> bool:
        return self.refusal.is_completed

    @property
    def original(self) -> Refusal:
        return self.refusal.original

    @property
    def text(self) -> str:
        skip = f" (to pass it: {self.skip_flag})" if self.skip_flag else ""
        return f"refused by {self.guard}: {super().text}{skip}"
