from dataclasses import dataclass

TIME_LIMIT = "time"
COST_LIMIT = "cost"


@dataclass(frozen=True)
class HelperSpend:
    """What a job has used against its limits; a program that reports no cost and a limit of 0 count for nothing."""

    minutes: float
    cost_dollars: float | None
    max_minutes: int
    max_cost: int

    @property
    def cost_share(self) -> float:
        return self.cost_dollars / self.max_cost if self.cost_dollars is not None and self.max_cost else 0.0

    @property
    def time_share(self) -> float:
        return self.minutes / self.max_minutes if self.max_minutes else 0.0

    @property
    def share(self) -> float:
        return max(self.time_share, self.cost_share)

    @property
    def limit_name(self) -> str:
        return COST_LIMIT if self.cost_share > self.time_share else TIME_LIMIT
