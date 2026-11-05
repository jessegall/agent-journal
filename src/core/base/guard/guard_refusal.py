from core.base.refusal import Refusal


class GuardRefusal(Refusal):
    """A refusal from a guard, naming the guard and the flag that lets a person pass it."""

    def __init__(self, guard: str, refusal: Refusal, skip_flag: str) -> None:
        super().__init__(refusal.reason, refusal.suggestion)
        self.guard, self.skip_flag = guard, skip_flag

    @property
    def text(self) -> str:
        skip = f" (to pass it: {self.skip_flag})" if self.skip_flag else ""
        return f"refused by {self.guard}: {super().text}{skip}"
