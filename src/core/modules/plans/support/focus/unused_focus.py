from dataclasses import dataclass


@dataclass(frozen=True)
class UnusedFocus:
    """A plan an agent named as its focus that is not used now, with the state that keeps it from being used:
    blocked, completed, cancelled, not approved, or gone when the plan was deleted. The choice is kept, and
    counts again once the plan is started."""

    plan_id: int
    state: str

    @property
    def line(self) -> str:
        return f"your focus on plan {self.plan_id} is not used: the plan is {self.state}"
