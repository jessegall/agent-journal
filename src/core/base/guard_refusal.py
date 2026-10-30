from core.base.refusal import Refusal


class GuardRefusal(Refusal):
    """A refusal a guard made, naming the guard and, when it has one, the flag that passes it knowingly."""

    def __init__(self, guard: str, refusal: Refusal, waive_flag: str) -> None:
        super().__init__(refusal.reason, refusal.remedy)
        self.guard, self.waive_flag = guard, waive_flag

    @property
    def text(self) -> str:
        waive = f" (to pass it knowingly: {self.waive_flag})" if self.waive_flag else ""
        return f"refused by {self.guard}: {super().text}{waive}"
