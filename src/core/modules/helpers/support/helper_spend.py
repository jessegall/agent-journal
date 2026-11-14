from dataclasses import dataclass

TIME_LIMIT = "time"
COST_LIMIT = "cost"


@dataclass(frozen=True)
class HelperSpend:
    """What a job has used against its limits. Its cost is the session's reported cost less the cost the
    session had when the job began; a reading or a baseline that is missing, or a reading below the
    baseline because the program's counter started over, leaves the cost unknown, never zero. A limit of 0
    counts for nothing."""

    minutes: float
    cost_dollars: float | None
    cost_baseline: float | None
    max_minutes: int
    max_cost: float

    @property
    def cost_spent(self) -> float | None:
        if self.cost_dollars is None or self.cost_baseline is None or self.cost_dollars < self.cost_baseline:
            return None
        return self.cost_dollars - self.cost_baseline

    @property
    def cost_uncertain(self) -> bool:
        return bool(self.max_cost) and self.cost_spent is None

    @property
    def cost_share(self) -> float:
        return self.cost_spent / self.max_cost if self.cost_spent is not None and self.max_cost else 0.0

    @property
    def time_share(self) -> float:
        return self.minutes / self.max_minutes if self.max_minutes else 0.0

    @property
    def share(self) -> float:
        return max(self.time_share, self.cost_share)

    @property
    def limit_name(self) -> str:
        return COST_LIMIT if self.cost_share > self.time_share else TIME_LIMIT
